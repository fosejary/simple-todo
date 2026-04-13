import { Platform } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widget-task-handler';

// Register widget handler BEFORE Expo Router loads
if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
}

// Then load Expo Router
import 'expo-router/entry';
