import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export default function GlassCard({
  children, style, padded = true,
}: { children: React.ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.borderGlass,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: padded ? 18 : 0,
          shadowColor: '#000',
          shadowOpacity: theme.name === 'dark' ? 0.35 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
