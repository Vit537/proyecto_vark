import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, RefreshControl, Linking, TextInput } from 'react-native';
import { Play, FileText, Headphones, Code2, ExternalLink, Search } from 'lucide-react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius } from '@/theme/tokens';
import { listarRecursos } from '@/api/endpoints';
import type { Recurso, TipoFormato } from '@/api/types';

const ICON: Record<TipoFormato, any> = { video: Play, articulo: FileText, documento: FileText, ejercicio: Code2 };

export default function Recursos() {
  const { theme } = useTheme();
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [q, setQ] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try { setRecursos(await listarRecursos()); } catch { /* mantener */ }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);
  const onRefresh = useCallback(async () => { setRefreshing(true); await cargar(); setRefreshing(false); }, [cargar]);

  const filtered = recursos.filter((r) =>
    !q || r.titulo.toLowerCase().includes(q.toLowerCase()) || (r.descripcion ?? '').toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Screen
      title="Recursos"
      subtitle={`${recursos.length} disponibles`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBlue} />}
    >
      {/* Buscador */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16,
        backgroundColor: theme.bgGlass, borderWidth: 1, borderColor: theme.borderGlass,
        borderRadius: radius.md, paddingHorizontal: 14,
      }}>
        <Search size={15} color={theme.textMuted} />
        <TextInput
          placeholder="Buscar recurso…"
          placeholderTextColor={theme.textMuted}
          value={q}
          onChangeText={setQ}
          style={{ flex: 1, color: theme.textPrimary, fontFamily: fonts.body, fontSize: 14, paddingVertical: 12 }}
        />
      </View>

      <View style={{ gap: 12 }}>
        {filtered.length === 0 ? (
          <GlassCard><Text style={{ color: theme.textMuted, fontFamily: fonts.body }}>No se encontraron recursos.</Text></GlassCard>
        ) : filtered.map((r) => {
          const Icon = ICON[r.tipo_formato] ?? FileText;
          return (
            <Pressable key={r.id} onPress={() => r.url && Linking.openURL(r.url).catch(() => {})}>
              <GlassCard>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: theme.accentBlue + '1a', borderWidth: 1, borderColor: theme.accentBlue + '33',
                  }}>
                    <Icon size={18} color={theme.accentBlue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: theme.textPrimary, marginBottom: 6 }}>{r.titulo}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Badge label={r.categoria_vark} kind={r.categoria_vark} />
                      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted }}>{r.tema_nombre}</Text>
                    </View>
                  </View>
                  <ExternalLink size={16} color={theme.textMuted} />
                </View>
              </GlassCard>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
