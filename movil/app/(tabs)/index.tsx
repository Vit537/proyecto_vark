import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Award, ChevronRight } from 'lucide-react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import VarkRadar, { VarkBars } from '@/components/ui/VarkRadar';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { dashboardEstudiante, misRecomendaciones } from '@/api/endpoints';
import type { Recomendacion } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';

type Vark = { V: number; A: number; R: number; K: number };
const VARK_LABEL: Record<string, string> = { V: 'Visual', A: 'Auditivo', R: 'Lectura', K: 'Kinestésico' };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Dashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [vark, setVark] = useState<Vark>({ V: 0, A: 0, R: 0, K: 0 });
  const [dominante, setDominante] = useState<string>('V');
  const [recursos, setRecursos] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [recom, setRecom] = useState<Recomendacion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const d = await dashboardEstudiante();
      const pv = d.perfil_vark;
      setVark({ V: Math.round((pv.V ?? 0) * 100), A: Math.round((pv.A ?? 0) * 100), R: Math.round((pv.R ?? 0) * 100), K: Math.round((pv.K ?? 0) * 100) });
      setDominante(d.estilo_dominante || 'V');
      setRecursos(d.total_recursos_vistos);
      setQuizzes(d.total_quizzes_realizados);
    } catch { /* mantener */ }
    try {
      const r = await misRecomendaciones();
      setRecom(r.slice(0, 3));
    } catch { /* mantener */ }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }, [cargar]);

  const domKey = (dominante[0] as 'V' | 'A' | 'R' | 'K') || 'V';

  return (
    <Screen
      title={`${greeting()}`}
      subtitle={user?.nombre_completo ?? 'Estudiante'}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBlue} />}
    >
      {/* KPIs */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <GlassCard style={{ flex: 1 }}>
          <BookOpen size={18} color={theme.accentBlue} />
          <Text style={{ fontFamily: fonts.syneExtra, fontSize: 26, color: theme.textPrimary, marginTop: 10 }}>{recursos}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textSecondary }}>Recursos vistos</Text>
        </GlassCard>
        <GlassCard style={{ flex: 1 }}>
          <Award size={18} color={theme.success} />
          <Text style={{ fontFamily: fonts.syneExtra, fontSize: 26, color: theme.textPrimary, marginTop: 10 }}>{quizzes}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textSecondary }}>Quizzes hechos</Text>
        </GlassCard>
      </View>

      {/* Perfil VARK */}
      <GlassCard style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.syne, fontSize: 16, color: theme.textPrimary }}>Tu perfil de aprendizaje</Text>
          <Badge label={VARK_LABEL[domKey] ?? 'Visual'} kind={domKey} />
        </View>
        <VarkRadar data={vark} size={236} />
        <View style={{ marginTop: 12 }}>
          <VarkBars data={vark} />
        </View>
      </GlassCard>

      {/* Recomendados */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontFamily: fonts.syne, fontSize: 16, color: theme.textPrimary }}>Recomendados para ti</Text>
        <Text onPress={() => router.push('/(tabs)/recomendaciones')} style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.accentBlue }}>
          Ver todos
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {recom.length === 0 ? (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>Aún no hay recomendaciones. Toma un test por tema para generarlas.</Text></GlassCard>
        ) : recom.map((r) => (
          <GlassCard key={r.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: theme.textPrimary, marginBottom: 6 }}>{r.recurso_titulo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Badge label={r.recurso_categoria_vark} kind={r.recurso_categoria_vark} />
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted }}>{r.tema_nombre} · {Math.round(r.puntuacion * 100)}%</Text>
                </View>
              </View>
              <ChevronRight size={18} color={theme.textMuted} />
            </View>
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}
