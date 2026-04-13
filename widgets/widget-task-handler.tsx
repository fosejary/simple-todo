import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { buildWidgetElement } from './buildWidgetElement';

/**
 * Widget name must match the `name` field in app.json plugin config.
 */
const WIDGET_NAME = 'SimpleTodoWidget';

/**
 * The widget task handler is called by the Android system whenever
 * the widget needs to be rendered or updated.
 *
 * The handler receives a `renderWidget` callback that must be called
 * with the widget JSX to render.
 */
export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
): Promise<void> {
  const widgetName = props.widgetInfo.widgetName;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      if (widgetName === WIDGET_NAME) {
        const element = await buildWidgetElement();
        props.renderWidget(element);
        return;
      }
      break;
    }

    case 'WIDGET_CLICK': {
      // Handle click actions from within the widget.
      // Currently clicks just refresh the widget data.
      // Toggle actions are delegated to the main app via OPEN_APP.
      if (widgetName === WIDGET_NAME) {
        const element = await buildWidgetElement();
        props.renderWidget(element);
        return;
      }
      break;
    }

    case 'WIDGET_DELETED':
      // Nothing to clean up
      return;

    default:
      break;
  }

  // Fallback: render with current data
  const element = await buildWidgetElement();
  props.renderWidget(element);
}
