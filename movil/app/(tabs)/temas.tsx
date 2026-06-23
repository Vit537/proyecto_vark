import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, ChevronDown, Layers } from 'lucide-react-native';
import { MotiView } from 'moti';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { listarTemasCompletos } from '@/api/endpoints';
import type { Tema } from '@/api/types';

export default function Temas() {
  const { theme } = useTheme();
  const router = useRouter();
  const [temas, setTemas] = useState<Tema[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try { setTemas(await listarTemasCompletos()); } catch { /* mantener */ }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await cargar(); setRefreshing(false); }, [cargar]);

  return (
    <Screen
      title="Temas"
      subtitle="Explora y toma tu test por tema"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBlue} />}
    >
      <View style={{ gap: 12 }}>
        {temas.length === 0 ? (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>No hay temas disponibles.</Text></GlassCard>
        ) : temas.map((t) => {
          const open = expanded === t.id;
          return (
            <GlassCard key={t.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{
                  width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme.accentBlue + '1f', borderWidth: 1, borderColor: theme.accentBlue + '3d',
                }}>
                  <Layers size={18} color={theme.accentBlue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: theme.textPrimary }}>{t.nombre}</Text>
                  {t.subtemas?.length ? (
                    <Pressable onPress={() => setExpanded(open ? null : t.id)} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted }}>{t.subtemas.length} subtemas</Text>
                      <ChevronDown size={13} color={theme.textMuted} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
                    </Pressable>
                  ) : null}
                </View>
                <Pressable onPress={() => router.push(`/quiz/${t.id}`)}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.sm,
                    backgroundColor: theme.accentBlue + '1f', borderWidth: 1, borderColor: theme.accentBlue + '47',
                  }}>
                    <GraduationCap size={14} color={theme.accentBlue} />
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: theme.accentBlue }}>Tomar test</Text>
                  </View>
                </Pressable>
              </View>

              {open && t.subtemas?.length ? (
                <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12, gap: 8 }}>
                  {t.subtemas.map((s) => (
                    <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
                      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: theme.accentCyan }} />
                      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.textSecondary }}>{s.nombre}</Text>
                    </View>
                  ))}
                </MotiView>
              ) : null}
            </GlassCard>
          );
        })}
      </View>
    </Screen>
  );
}
