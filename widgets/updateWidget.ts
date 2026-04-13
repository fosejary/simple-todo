import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import type { WidgetInfo } from 'react-native-android-widget';
import { buildWidgetElement } from './buildWidgetElement';

const WIDGET_NAME = 'SimpleTodoWidget';

/**
 * Request the Android widget to refresh with the latest todo data.
 * No-op on non-Android platforms.
 *
 * Call this after any todo mutation (add, toggle, delete, update)
 * to keep the home screen widget in sync.
 */
export async function updateTodoWidget(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: async (_info: WidgetInfo) => {
        return buildWidgetElement();
      },
      widgetNotFound: () => {
        // No widget on home screen -- nothing to do
      },
    });
  } catch {
    // Widget update failures should never crash the app
  }
}
