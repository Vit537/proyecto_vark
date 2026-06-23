import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Check, ArrowRight, X, Trophy, RotateCcw } from 'lucide-react-native';
import AppBackground from '@/components/AppBackground';
import GlassCard from '@/components/ui/GlassCard';
import AppButton from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { obtenerPreguntasQuiz, responderQuiz } from '@/api/endpoints';
import type { PreguntaFrontend, ResultadoQuiz } from '@/api/types';

export default function Quiz() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const temaPk = Number(id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaFrontend[]>([]);
  const [idx, setIdx] = useState(0);
  const [resp, setResp] = useState<Record<number, number>>({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);

  useEffect(() => {
    obtenerPreguntasQuiz(temaPk)
      .then((d) => setPreguntas(d.preguntas))
      .catch((e) => setError(e instanceof Error ? e.message : 'No se pudo cargar el quiz.'))
      .finally(() => setLoading(false));
  }, [temaPk]);

  const actual = preguntas[idx];
  const elegido = actual ? resp[actual.id] : undefined;
  const esUltima = idx === preguntas.length - 1;

  const enviar = async () => {
    setEnviando(true);
    try {
      const r = await responderQuiz({
        tema_id: temaPk,
        respuestas: Object.entries(resp).map(([pid, oid]) => ({ pregunta_id: Number(pid), opcion_id: oid })),
      });
      setResultado(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el quiz.');
    } finally {
      setEnviando(false);
    }
  };

  const cerrar = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <AppBackground />
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={cerrar} hitSlop={10} style={{
          width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
          backgroundColor: theme.bgGlass, borderWidth: 1, borderColor: theme.borderGlass,
        }}>
          <X size={16} color={theme.textMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 40 + insets.bottom }}>
        {loading ? (
          <ActivityIndicator color={theme.accentBlue} style={{ marginTop: 60 }} />
        ) : error ? (
          <GlassCard>
            <Text style={{ color: theme.danger, fontFamily: fonts.body, fontSize: 14 }}>{error}</Text>
            <AppButton label="Volver" variant="outline" onPress={cerrar} style={{ marginTop: 14 }} />
          </GlassCard>
        ) : resultado ? (
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 350 }}>
            <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                backgroundColor: theme.warning + '24', borderWidth: 1, borderColor: theme.warning + '55',
              }}>
                <Trophy size={30} color={theme.warning} />
              </View>
              <Text style={{ fontFamily: fonts.syneExtra, fontSize: 34, color: theme.textPrimary }}>{resultado.puntaje_porcentaje}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>
                {resultado.respuestas_correctas} de {resultado.total_preguntas} correctas
              </Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{resultado.tema_nombre}</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, alignSelf: 'stretch' }}>
                <AppButton label="Reintentar" variant="ghost" icon={<RotateCcw size={15} color={theme.textSecondary} />}
                  onPress={() => { setResultado(null); setResp({}); setIdx(0); }} style={{ flex: 1 }} />
                <AppButton label="Terminar" onPress={cerrar} style={{ flex: 1 }} />
              </View>
            </GlassCard>
          </MotiView>
        ) : actual ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: theme.bgGlassHover, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${((idx + 1) / preguntas.length) * 100}%`, backgroundColor: theme.accentBlue, borderRadius: 99 }} />
              </View>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12 }}>{idx + 1}/{preguntas.length}</Text>
            </View>

            <AnimatePresence exitBeforeEnter>
              <MotiView key={actual.id}
                from={{ opacity: 0, translateX: 30 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -30 }}
                transition={{ type: 'timing', duration: 240 }}
              >
                <GlassCard>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: theme.textPrimary, marginBottom: 16, lineHeight: 23 }}>
                    {actual.enunciado}
                  </Text>
                  <View style={{ gap: 10 }}>
                    {actual.opciones.map((op) => {
                      const sel = elegido === op.id;
                      return (
                        <Pressable key={op.id} onPress={() => setResp((r) => ({ ...r, [actual.id]: op.id }))}>
                          <View style={{
                            flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md,
                            backgroundColor: sel ? theme.accentBlue + '1f' : theme.bgGlass,
                            borderWidth: 1, borderColor: sel ? theme.accentBlue : theme.borderGlass,
                          }}>
                            <View style={{
                              width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                              borderWidth: 1.5, borderColor: sel ? theme.accentBlue : theme.textMuted,
                              backgroundColor: sel ? theme.accentBlue : 'transparent',
                            }}>
                              {sel ? <Check size={13} color="#fff" /> : null}
                            </View>
                            <Text style={{ flex: 1, color: theme.textPrimary, fontFamily: fonts.body, fontSize: 14 }}>{op.texto}</Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </GlassCard>
              </MotiView>
            </AnimatePresence>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
              {idx > 0 && <AppButton label="Anterior" variant="ghost" onPress={() => setIdx((i) => i - 1)} style={{ flex: 1 }} />}
              <AppButton
                label={esUltima ? 'Finalizar' : 'Siguiente'}
                onPress={esUltima ? enviar : () => setIdx((i) => i + 1)}
                disabled={elegido === undefined}
                loading={enviando}
                icon={!esUltima ? <ArrowRight size={16} color="#fff" /> : undefined}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>Este tema no tiene preguntas disponibles todavía.</Text></GlassCard>
        )}
      </ScrollView>
    </View>
  );
}
