import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  type TextProps,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { Fonts } from '@/constants/theme';

/**
 * Custom fonts on Android need one family per weight, so map `fontWeight`
 * to the matching Gothic A1 file. An explicit `fontFamily` (e.g. the display
 * face) is left alone.
 */
export function resolveFont(style: TextStyle | undefined): TextStyle {
  const family = style?.fontFamily;
  if (family && family !== Fonts.regular) return { fontWeight: 'normal' };
  const w = String(style?.fontWeight ?? '400');
  const fontFamily =
    w === '600' || w === '700' || w === '800' || w === '900' || w === 'bold'
      ? Fonts.semibold
      : w === '500'
        ? Fonts.medium
        : Fonts.regular;
  return { fontFamily, fontWeight: 'normal' };
}

export const Text = forwardRef<RNText, TextProps>(function Text({ style, ...rest }, ref) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  return <RNText ref={ref} {...rest} style={[style, resolveFont(flat)]} />;
});

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { style, ...rest },
  ref
) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  return <RNTextInput ref={ref} {...rest} style={[style, resolveFont(flat)]} />;
});
