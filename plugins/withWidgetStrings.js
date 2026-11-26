/**
 * Default (fallback) Android strings for the home-screen widget picker.
 *
 * The widget's label points at @string/widget_label and its description at
 * @string/widget_simpletodowidget_description; per-language values come from
 * `expo.locales` (i18n/native/*.json). react-native-android-widget writes the
 * description as translatable="false", which would make the translations a lint
 * error, so this rewrites it as an ordinary translatable string.
 *
 * Order matters: Android mods run in reverse plugin order, so list this plugin
 * BEFORE react-native-android-widget in app.json for its strings to win.
 */
const { withStringsXml, AndroidConfig } = require('expo/config-plugins');

// Pass plain text: Expo escapes apostrophes and backslashes when it writes
// strings.xml. Escaping here too produced `today\\'s`, which aapt rejects
// ("Invalid unicode escape sequence") and fails the release build.
module.exports = function withWidgetStrings(config, { label, description }) {
  return withStringsXml(config, (cfg) => {
    cfg.modResults = AndroidConfig.Strings.setStringItem(
      [
        { $: { name: 'widget_label' }, _: String(label) },
        { $: { name: 'widget_simpletodowidget_description' }, _: String(description) },
      ],
      cfg.modResults
    );
    return cfg;
  });
};
