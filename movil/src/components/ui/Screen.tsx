import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControlProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import AppBackground from '@/components/AppBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

interface ScreenProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  scroll?: boolean;
  right?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

/** Contenedor de pantalla: fondo de figuritas + header con toggle de tema. */
export default function Screen({ title, subtitle, children, scroll = true, right, refreshControl }: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const header = title ? (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.syneExtra, fontSize: 24, color: theme.textPrimary }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {right}
        <ThemeToggle />
      </View>
    </View>
  ) : null;

  const body = (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 360 }}
      style={{ paddingHorizontal: 18, paddingBottom: 28 + insets.bottom }}
    >
      {header}
      {children}
    </MotiView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <AppBackground />
      <View style={{ flex: 1, paddingTop: insets.top + 8 }}>
        {scroll ? (
          <ScrollView showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 20, gap: 12,
  },
});
