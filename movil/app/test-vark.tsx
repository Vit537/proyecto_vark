import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Check, ArrowRight, Brain } from 'lucide-react-native';
import AppBackground from '@/components/AppBackground';
import GlassCard from '@/components/ui/GlassCard';
import AppButton from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { generarTestVARK, completarTestVARK } from '@/api/endpoints';
import type { PreguntaTest } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';

export default function TestVark() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setVarkCompletado, refresh } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaTest[]>([]);
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    generarTestVARK()
      .then((data) => {
        if (data.completado) { router.replace('/(tabs)'); return; }
        setSesionId(data.sesion_id);
        setPreguntas(data.preguntas);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'No se pudo cargar el test.'))
      .finally(() => setLoading(false));
  }, []);

  const actual = preguntas[idx];
  const elegido = actual ? respuestas[String(actual.id)] : undefined;
  const esUltima = idx === preguntas.length - 1;

  const elegir = (opcionId: string) => {
    if (!actual) return;
    setRespuestas((r) => ({ ...r, [String(actual.id)]: opcionId }));
  };

  const siguiente = async () => {
    if (!esUltima) { setIdx((i) => i + 1); return; }
    if (!sesionId) return;
    setEnviando(true);
    try {
      await completarTestVARK({ sesion_id: sesionId, respuestas });
      setVarkCompletado(true);
      await refresh();
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el test.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <AppBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View style={{
            width: 52, height: 52, borderRadius: radius.md, marginBottom: 12,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.accentPurple + '26', borderWidth: 1, borderColor: theme.accentPurple + '4d',
          }}>
            <Brain size={26} color={theme.accentPurple} />
          </View>
          <Text style={{ fontFamily: fonts.syneExtra, fontSize: 22, color: theme.textPrimary, textAlign: 'center' }}>
            Tu test <Text style={{ color: theme.accentBlue }}>VARK</Text>
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.textSecondary, marginTop: 4, textAlign: 'center' }}>
            Responde para conocer tu estilo de aprendizaje
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.accentBlue} style={{ marginTop: 40 }} />
        ) : error ? (
          <GlassCard>
            <Text style={{ color: theme.danger, fontFamily: fonts.body, fontSize: 14 }}>{error}</Text>
            <AppButton label="Volver" variant="outline" onPress={() => router.replace('/(tabs)')} style={{ marginTop: 14 }} />
          </GlassCard>
        ) : actual ? (
          <>
            {/* Progreso */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: theme.bgGlassHover, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${((idx + 1) / preguntas.length) * 100}%`, backgroundColor: theme.accentBlue, borderRadius: 99 }} />
              </View>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12 }}>
                {idx + 1}/{preguntas.length}
              </Text>
            </View>

            <AnimatePresence exitBeforeEnter>
              <MotiView
                key={actual.id}
                from={{ opacity: 0, translateX: 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -30 }}
                transition={{ type: 'timing', duration: 250 }}
              >
                <GlassCard>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: theme.textPrimary, marginBottom: 16, lineHeight: 23 }}>
                    {actual.enunciado}
                  </Text>
                  <View style={{ gap: 10 }}>
                    {actual.opciones.map((op) => {
                      const sel = elegido === op.id;
                      return (
                        <Pressable key={op.id} onPress={() => elegir(op.id)}>
                          <View style={{
                            flexDirection: 'row', alignItems: 'center', gap: 12,
                            padding: 14, borderRadius: radius.md,
                            backgroundColor: sel ? theme.accentBlue + '1f' : theme.bgGlass,
                            borderWidth: 1, borderColor: sel ? theme.accentBlue : theme.borderGlass,
                          }}>
                            <View style={{
                              width: 22, height: 22, borderRadius: 11,
                              alignItems: 'center', justifyContent: 'center',
                              borderWidth: 1.5, borderColor: sel ? theme.accentBlue : theme.textMuted,
                              backgroundColor: sel ? theme.accentBlue : 'transparent',
                            }}>
                              {sel ? <Check size={13} color="#fff" /> : null}
                            </View>
                            <Text style={{ flex: 1, color: theme.textPrimary, fontFamily: fonts.body, fontSize: 14 }}>
                              {op.texto}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </GlassCard>
              </MotiView>
            </AnimatePresence>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
              {idx > 0 && (
                <AppButton label="Anterior" variant="ghost" onPress={() => setIdx((i) => i - 1)} style={{ flex: 1 }} />
              )}
              <AppButton
                label={esUltima ? 'Finalizar' : 'Siguiente'}
                onPress={siguiente}
                disabled={!elegido}
                loading={enviando}
                icon={!esUltima ? <ArrowRight size={16} color="#fff" /> : undefined}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
