import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { parseISO } from 'date-fns';
import i18n from '@/i18n';
import { useTodoStore, whenTodosHydrated } from '@/stores/todoStore';
import type { Todo } from '@/lib/types';

/**
 * Local reminders for todos with a date + time.
 *
 * The schedule is always derived from the store: `syncReminders()` diffs what
 * should be scheduled against what is, so completing, deleting, moving,
 * undoing or editing a todo all reschedule through one path.
 */

export const REMINDER_TASK = 'simpletodo-reminder-response';
const CATEGORY = 'todo-reminder';
const ACTION_COMPLETE = 'complete';
const ACTION_SNOOZE = 'snooze';
const CHANNEL_DEFAULT = 'reminders';
const CHANNEL_IMPORTANT = 'reminders-important';
const SNOOZE_MS = 10 * 60 * 1000;

const supported = Platform.OS === 'android' || Platform.OS === 'ios';

let configured: Promise<void> | null = null;

export function configureReminders(): Promise<void> {
  if (!supported) return Promise.resolve();
  if (configured) return configured;
  configured = (async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_DEFAULT, {
        name: i18n.t('reminder.channelDefault'),
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250],
        lightColor: '#EE8F1F',
      });
      await Notifications.setNotificationChannelAsync(CHANNEL_IMPORTANT, {
        name: i18n.t('reminder.channelImportant'),
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500, 250, 500],
        lightColor: '#EE8F1F',
      });
    }
    await Notifications.setNotificationCategoryAsync(CATEGORY, [
      {
        identifier: ACTION_COMPLETE,
        buttonTitle: i18n.t('reminder.actionComplete'),
        options: { opensAppToForeground: false },
      },
      {
        identifier: ACTION_SNOOZE,
        buttonTitle: i18n.t('reminder.actionSnooze'),
        options: { opensAppToForeground: false },
      },
    ]);
  })().catch(() => {
    configured = null;
  });
  return configured;
}

export type ReminderPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

export async function getReminderPermission(): Promise<ReminderPermission> {
  if (!supported) return 'unsupported';
  const p = await Notifications.getPermissionsAsync();
  if (p.granted) return 'granted';
  return p.canAskAgain ? 'undetermined' : 'denied';
}

/** Asks for notification permission if it hasn't been decided yet. */
export async function ensureReminderPermission(): Promise<boolean> {
  if (!supported) return false;
  await configureReminders(); // Android shows the prompt only once a channel exists.
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

function triggerTime(todo: Todo, now: number): number | null {
  if (todo.is_deleted || todo.is_completed || !todo.due_date || !todo.due_time) return null;
  const snooze = todo.snooze_until ? Date.parse(todo.snooze_until) : NaN;
  const at = snooze > now ? snooze : parseISO(`${todo.due_date}T${todo.due_time}:00`).getTime();
  return at > now ? at : null;
}

async function syncNow(): Promise<void> {
  if (!supported) return;
  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;
  await configureReminders();

  const now = Date.now();
  const { todos, categories } = useTodoStore.getState();
  const desired = new Map<string, { todo: Todo; at: number; fp: string }>();
  for (const todo of todos) {
    const at = triggerTime(todo, now);
    if (at === null) continue;
    desired.set(todo.id, { todo, at, fp: `${at}|${todo.title}|${todo.priority}|${i18n.language}` });
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const have = new Map<string, unknown>(
    scheduled.map((r) => [r.identifier, (r.content.data as { fp?: string } | undefined)?.fp])
  );

  for (const [id, fp] of have) {
    if (desired.get(id)?.fp !== fp) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  for (const [id, { todo, at, fp }] of desired) {
    if (have.get(id) === fp) continue;
    const category = categories.find((c) => c.id === todo.category_id);
    const important = todo.priority > 0;
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: todo.title,
        body: [todo.due_time, category?.name].filter(Boolean).join(' · '),
        data: { todoId: id, fp },
        categoryIdentifier: CATEGORY,
        sound: 'default',
        priority: important
          ? Notifications.AndroidNotificationPriority.MAX
          : Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
        channelId: important ? CHANNEL_IMPORTANT : CHANNEL_DEFAULT,
      },
    });
  }
}

let chain: Promise<void> = Promise.resolve();
let timer: ReturnType<typeof setTimeout> | null = null;

/** Reconcile scheduled notifications with the store now (serialized). */
export function syncReminders(): Promise<void> {
  chain = chain.then(syncNow).catch(() => {});
  return chain;
}

/** Debounced sync for bursts of store changes. */
export function scheduleReminderSync(delay = 400) {
  if (!supported) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    syncReminders();
  }, delay);
}

/** Keep reminders in step with the store for the lifetime of the app. */
export function startReminderSync(): () => void {
  if (!supported) return () => {};
  configureReminders().then(() => syncReminders());
  return useTodoStore.subscribe((state, prev) => {
    if (state.todos !== prev.todos || state.categories !== prev.categories) {
      scheduleReminderSync();
    }
  });
}

/** Handles the notification buttons, from the foreground listener or the background task. */
export async function handleReminderResponse(
  actionIdentifier: string,
  notification: Notifications.Notification
): Promise<void> {
  const data = notification.request.content.data as { todoId?: string } | undefined;
  const todoId = data?.todoId;
  if (!todoId || (actionIdentifier !== ACTION_COMPLETE && actionIdentifier !== ACTION_SNOOZE)) {
    return; // A plain tap just opens the app.
  }
  await whenTodosHydrated();
  const store = useTodoStore.getState();
  const todo = store.todos.find((t) => t.id === todoId);
  if (todo && !todo.is_completed && !todo.is_deleted) {
    if (actionIdentifier === ACTION_COMPLETE) {
      store.toggleTodo(todoId);
    } else {
      store.updateTodo(todoId, { snooze_until: new Date(Date.now() + SNOOZE_MS).toISOString() });
    }
  }
  await Notifications.dismissNotificationAsync(notification.request.identifier).catch(() => {});
  await syncReminders();
}

/** Payload the background notification task receives on Android action presses. */
export function isResponsePayload(data: unknown): data is Notifications.NotificationResponse {
  return !!data && typeof data === 'object' && 'actionIdentifier' in data && 'notification' in data;
}
