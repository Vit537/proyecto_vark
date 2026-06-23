import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import {
  LayoutDashboard, BookOpen, FileText, Sparkles, Clock, User,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { fonts } from '@/theme/tokens';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgPrimary }}>
        <ActivityIndicator color={theme.accentBlue} />
      </View>
    );
  }
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accentBlue,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.bgSecondary,
          borderTopColor: theme.borderGlass,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 10 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} /> }} />
      <Tabs.Screen name="temas" options={{ title: 'Temas', tabBarIcon: ({ color }) => <BookOpen size={20} color={color} /> }} />
      <Tabs.Screen name="recursos" options={{ title: 'Recursos', tabBarIcon: ({ color }) => <FileText size={20} color={color} /> }} />
      <Tabs.Screen name="recomendaciones" options={{ title: 'Para ti', tabBarIcon: ({ color }) => <Sparkles size={20} color={color} /> }} />
      <Tabs.Screen name="historial" options={{ title: 'Historial', tabBarIcon: ({ color }) => <Clock size={20} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <User size={20} color={color} /> }} />
    </Tabs>
  );
}
