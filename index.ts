import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widget-task-handler';
import { REMINDER_TASK, handleReminderResponse, isResponsePayload } from './lib/reminders';

// Register background handlers BEFORE Expo Router loads, at module scope, so
// they also run when Android starts the JS bundle headlessly.
if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);

  // Reminder buttons ([완료] / [10분 뒤]) pressed while the app is closed.
  TaskManager.defineTask(REMINDER_TASK, async ({ data, error }) => {
    if (error || !isResponsePayload(data)) return;
    await handleReminderResponse(data.actionIdentifier, data.notification);
  });
  Notifications.registerTaskAsync(REMINDER_TASK).catch(() => {});
}

// Then load Expo Router
import 'expo-router/entry';
