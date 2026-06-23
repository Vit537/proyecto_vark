import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, RefreshControl, Linking } from 'react-native';
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { misRecomendaciones, valorarRecurso } from '@/api/endpoints';
import type { Recomendacion } from '@/api/types';

export default function Recomendaciones() {
  const { theme } = useTheme();
  const [items, setItems] = useState<Recomendacion[]>([]);
  const [voto, setVoto] = useState<Record<number, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try { setItems(await misRecomendaciones()); } catch { /* mantener */ }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  const onRefresh = useCallback(async () => { setRefreshing(true); await cargar(); setRefreshing(false); }, [cargar]);

  const votar = (recurso: number, util: boolean) => {
    setVoto((v) => ({ ...v, [recurso]: util }));
    valorarRecurso({ recurso, util }).catch(() => {});
  };

  return (
    <Screen
      title="Para ti"
      subtitle="Recursos recomendados según tu perfil"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBlue} />}
    >
      <View style={{ gap: 12 }}>
        {items.length === 0 ? (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            Aún no tienes recomendaciones. Toma un test por tema para generarlas.
          </Text></GlassCard>
        ) : items.map((r) => {
          const v = voto[r.recurso];
          return (
            <GlassCard key={r.id}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: theme.textPrimary, marginBottom: 6 }}>{r.recurso_titulo}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Badge label={r.recurso_categoria_vark} kind={r.recurso_categoria_vark} />
                    <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted }}>{r.tema_nombre} · {Math.round(r.puntuacion * 100)}%</Text>
                  </View>
                </View>
                <Pressable onPress={() => r.recurso_url && Linking.openURL(r.recurso_url).catch(() => {})} hitSlop={8}>
                  <ExternalLink size={16} color={theme.accentBlue} />
                </Pressable>
              </View>

              {r.justificacion ? (
                <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: theme.textSecondary, lineHeight: 18, marginBottom: 12 }}>
                  {r.justificacion}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={() => votar(r.recurso, true)} style={{ flex: 1 }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                    paddingVertical: 9, borderRadius: radius.sm,
                    backgroundColor: v === true ? theme.success + '24' : theme.bgGlass,
                    borderWidth: 1, borderColor: v === true ? theme.success : theme.borderGlass,
                  }}>
                    <ThumbsUp size={14} color={v === true ? theme.success : theme.textMuted} />
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, color: v === true ? theme.success : theme.textSecondary }}>Útil</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => votar(r.recurso, false)} style={{ flex: 1 }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                    paddingVertical: 9, borderRadius: radius.sm,
                    backgroundColor: v === false ? theme.danger + '24' : theme.bgGlass,
                    borderWidth: 1, borderColor: v === false ? theme.danger : theme.borderGlass,
                  }}>
                    <ThumbsDown size={14} color={v === false ? theme.danger : theme.textMuted} />
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, color: v === false ? theme.danger : theme.textSecondary }}>No útil</Text>
                  </View>
                </Pressable>
              </View>
            </GlassCard>
          );
        })}
      </View>
    </Screen>
  );
}
