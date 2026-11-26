import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { useTodoStore, whenTodosHydrated } from '@/stores/todoStore';
import { syncReminders } from '@/lib/reminders';
import { buildWidgetElement } from './buildWidgetElement';

/** Must match the `name` in the app.json widget plugin config. */
const WIDGET_NAME = 'SimpleTodoWidget';

/**
 * Called by Android whenever the widget needs to render, or when one of its
 * click areas is tapped (the app may not be running).
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetInfo.widgetName !== WIDGET_NAME) return;

  switch (props.widgetAction) {
    case 'WIDGET_DELETED':
      return;

    case 'WIDGET_CLICK': {
      const id = props.clickActionData?.id;
      if (props.clickAction === 'TOGGLE' && typeof id === 'string') {
        await whenTodosHydrated();
        const store = useTodoStore.getState();
        if (store.todos.some((t) => t.id === id && !t.is_deleted)) {
          // Same path as the app: recurrence, streak and reminders stay consistent.
          store.toggleTodo(id);
          await syncReminders();
        }
      }
      break;
    }

    default:
      break;
  }

  props.renderWidget(await buildWidgetElement());
}
