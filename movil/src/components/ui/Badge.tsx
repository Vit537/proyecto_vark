import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, varkColor } from '@/theme/tokens';
import type { EstiloVARK } from '@/api/types';

type BadgeKind = 'default' | 'success' | 'warning' | 'danger' | 'info' | EstiloVARK;

export default function Badge({ label, kind = 'default' }: { label: string; kind?: BadgeKind }) {
  const { theme } = useTheme();

  let color = theme.accentBlue;
  if (kind === 'success') color = theme.success;
  else if (kind === 'warning') color = theme.warning;
  else if (kind === 'danger') color = theme.danger;
  else if (kind === 'info') color = theme.info;
  else if (kind === 'V' || kind === 'A' || kind === 'R' || kind === 'K') color = varkColor(theme, kind);

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: color + '22',
        borderColor: color + '55',
        borderWidth: 1,
        borderRadius: 99,
        paddingHorizontal: 9,
        paddingVertical: 3,
      }}
    >
      <Text style={{ color, fontFamily: fonts.bodyBold, fontSize: 11 }}>{label}</Text>
    </View>
  );
}
