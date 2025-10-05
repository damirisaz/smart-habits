import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '../modules/ux/theme';

export default function Card({ style, ...props }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.md,
          padding: spacing.lg
        },
        style
      ]}
      {...props}
    />
  );
}


