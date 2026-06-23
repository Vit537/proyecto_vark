import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { Clock } from 'lucide-react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import { VarkBars } from '@/components/ui/VarkRadar';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { historialPerfilVARK } from '@/api/endpoints';
import type { HistorialPerfilVARK } from '@/api/types';

function fmt(d: string) {
  try { return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

export default function Historial() {
  const { theme } = useTheme();
  const [items, setItems] = useState<HistorialPerfilVARK[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try { setItems(await historialPerfilVARK()); } catch { /* mantener */ }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  const onRefresh = useCallback(async () => { setRefreshing(true); await cargar(); setRefreshing(false); }, [cargar]);

  const norm = (v: { V: number; A: number; R: number; K: number }) => ({
    V: Math.round((v.V ?? 0) * 100), A: Math.round((v.A ?? 0) * 100),
    R: Math.round((v.R ?? 0) * 100), K: Math.round((v.K ?? 0) * 100),
  });

  return (
    <Screen
      title="Historial"
      subtitle="Evolución de tu perfil VARK"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBlue} />}
    >
      <View style={{ gap: 12 }}>
        {items.length === 0 ? (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            Aún no hay registros. Tu perfil evoluciona a medida que usas la plataforma.
          </Text></GlassCard>
        ) : items.map((h) => (
          <GlassCard key={h.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={14} color={theme.accentCyan} />
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.textSecondary }}>{fmt(h.fecha)}</Text>
            </View>
            <VarkBars data={norm(h.vector)} />
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}
