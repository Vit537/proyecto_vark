import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Syne_700Bold, Syne_800ExtraBold,
} from '@expo-google-fonts/syne';
import {
  DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/auth/AuthProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const { name } = useTheme();
  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="test-vark" />
        <Stack.Screen name="quiz/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Syne_700Bold, Syne_800ExtraBold,
    DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootStack />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
