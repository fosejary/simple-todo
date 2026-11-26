import React from 'react';
import { Feather } from '@expo/vector-icons';

export type IconName = keyof typeof Feather.glyphMap;

/** UI chrome icons: one stroke set (Feather) everywhere. Category icons stay MaterialIcons (user data). */
export function Icon({ name, size = 18, color }: { name: IconName; size?: number; color: string }) {
  return <Feather name={name} size={size} color={color} />;
}
