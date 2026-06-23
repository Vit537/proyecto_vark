import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Punto de entrada: decide a dónde mandar según sesión y test VARK. */
export default function Index() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgPrimary }}>
        <ActivityIndicator color={theme.accentBlue} />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)" />;
}
