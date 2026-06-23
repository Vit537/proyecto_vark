import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Mail, Lock, Eye, EyeOff, Hexagon } from 'lucide-react-native';
import AppBackground from '@/components/AppBackground';
import GlassCard from '@/components/ui/GlassCard';
import AppButton from '@/components/ui/AppButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { login as loginApi } from '@/api/endpoints';
import { useAuth } from '@/auth/AuthProvider';

export default function Login() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) { setError('Completa correo y contraseña.'); return; }
    setLoading(true);
    try {
      const data = await loginApi({ email: email.trim(), password });
      await signIn(data.access, data.refresh, data.usuario, data.vark_completado);
      if (data.usuario.rol === 'estudiante' && !data.vark_completado) {
        router.replace('/test-vark');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const inputBox = {
    flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10,
    backgroundColor: theme.bgGlass, borderColor: theme.borderGlass, borderWidth: 1,
    borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 14,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <AppBackground />
      <View style={{ position: 'absolute', right: 18, top: insets.top + 8, zIndex: 10 }}>
        <ThemeToggle />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 22 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 420 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 26 }}>
            <View style={{
              width: 58, height: 58, borderRadius: radius.md, marginBottom: 14,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: theme.accentBlue + '26', borderWidth: 1, borderColor: theme.accentBlue + '4d',
            }}>
              <Hexagon size={28} color={theme.accentBlue} />
            </View>
            <Text style={{ fontFamily: fonts.syneExtra, fontSize: 26, color: theme.textPrimary }}>
              Bienvenido de <Text style={{ color: theme.accentBlue }}>vuelta</Text>
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.textSecondary, marginTop: 6 }}>
              Inicia sesión para continuar aprendiendo
            </Text>
          </View>

          <GlassCard>
            {error ? (
              <View style={{
                backgroundColor: theme.danger + '1a', borderColor: theme.danger + '4d', borderWidth: 1,
                borderRadius: radius.sm, padding: 11, marginBottom: 14,
              }}>
                <Text style={{ color: theme.danger, fontFamily: fonts.body, fontSize: 13 }}>{error}</Text>
              </View>
            ) : null}

            <View style={inputBox}>
              <Mail size={16} color={theme.textMuted} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ flex: 1, color: theme.textPrimary, fontFamily: fonts.body, fontSize: 15, paddingVertical: 13 }}
              />
            </View>

            <View style={inputBox}>
              <Lock size={16} color={theme.textMuted} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!show}
                style={{ flex: 1, color: theme.textPrimary, fontFamily: fonts.body, fontSize: 15, paddingVertical: 13 }}
              />
              <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
                {show ? <EyeOff size={16} color={theme.textMuted} /> : <Eye size={16} color={theme.textMuted} />}
              </Pressable>
            </View>

            <AppButton label="Iniciar sesión" onPress={onSubmit} loading={loading} fullWidth style={{ marginTop: 6 }} />
          </GlassCard>

          <Text style={{ textAlign: 'center', color: theme.textMuted, fontFamily: fonts.body, fontSize: 12, marginTop: 18 }}>
            App del estudiante · VARK
          </Text>
        </MotiView>
      </KeyboardAvoidingView>
    </View>
  );
}
