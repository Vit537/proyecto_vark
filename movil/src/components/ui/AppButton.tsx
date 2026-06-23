import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger';

export default function AppButton({
  label, onPress, variant = 'primary', loading, disabled, icon, style, fullWidth,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const bg = {
    primary: theme.accentBlue,
    ghost: 'transparent',
    outline: 'transparent',
    danger: theme.danger,
  }[variant];

  const fg = {
    primary: '#fff',
    ghost: theme.textSecondary,
    outline: theme.accentBlue,
    danger: '#fff',
  }[variant];

  const border = variant === 'outline' ? theme.accentBlue : 'transparent';

  return (
    <Pressable onPress={isDisabled ? undefined : onPress} style={fullWidth ? { width: '100%' } : undefined}>
      <MotiView
        animate={{ opacity: isDisabled ? 0.5 : 1 }}
        style={[
          {
            backgroundColor: bg,
            borderColor: border,
            borderWidth: variant === 'outline' ? 1 : 0,
            borderRadius: radius.md,
            paddingVertical: 13,
            paddingHorizontal: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={fg} size="small" />
        ) : (
          <>
            {icon}
            <Text style={{ color: fg, fontFamily: fonts.bodyBold, fontSize: 15 }}>{label}</Text>
          </>
        )}
      </MotiView>
    </Pressable>
  );
}
