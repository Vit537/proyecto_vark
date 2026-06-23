import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Mail, GraduationCap, Sun, Moon } from 'lucide-react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import AppButton from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { useAuth } from '@/auth/AuthProvider';

export default function Perfil() {
  const { theme, name, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const iniciales = user ? (user.nombre?.[0] ?? '') + (user.apellido?.[0] ?? '') : 'U';

  const onLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Screen title="Mi perfil" subtitle="Tu cuenta y preferencias">
      <GlassCard style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{
            width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.accentBlue,
          }}>
            <Text style={{ color: '#fff', fontFamily: fonts.syneExtra, fontSize: 22 }}>{iniciales.toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: theme.textPrimary }}>{user?.nombre_completo ?? 'Usuario'}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.textMuted, textTransform: 'capitalize' }}>{user?.rol ?? 'estudiante'}</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: theme.borderGlass, marginVertical: 16 }} />

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Mail size={15} color={theme.textMuted} />
            <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: theme.textSecondary }}>{user?.email ?? '—'}</Text>
          </View>
          {user?.carrera ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <GraduationCap size={15} color={theme.textMuted} />
              <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: theme.textSecondary }}>
                {user.carrera}{user.semestre ? ` · ${user.semestre}` : ''}
              </Text>
            </View>
          ) : null}
        </View>
      </GlassCard>

      {/* Apariencia */}
      <GlassCard style={{ marginBottom: 16 }}>
        <Text style={{ fontFamily: fonts.syne, fontSize: 15, color: theme.textPrimary, marginBottom: 12 }}>Apariencia</Text>
        <Pressable onPress={toggleTheme}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 14, borderRadius: radius.md, backgroundColor: theme.bgGlass,
            borderWidth: 1, borderColor: theme.borderGlass,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {name === 'dark' ? <Moon size={17} color={theme.accentCyan} /> : <Sun size={17} color={theme.warning} />}
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.textPrimary }}>
                Tema {name === 'dark' ? 'oscuro' : 'claro'}
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: theme.accentBlue }}>Cambiar</Text>
          </View>
        </Pressable>
      </GlassCard>

      <AppButton label="Cerrar sesión" variant="danger" icon={<LogOut size={16} color="#fff" />} onPress={onLogout} fullWidth />
    </Screen>
  );
}
