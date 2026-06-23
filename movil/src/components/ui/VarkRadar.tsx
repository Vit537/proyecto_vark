import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

interface Vark { V: number; A: number; R: number; K: number } // 0-100

/** Radar VARK (4 ejes: V arriba, A derecha, R abajo, K izquierda). */
export default function VarkRadar({ data, size = 240 }: { data: Vark; size?: number }) {
  const { theme } = useTheme();
  const c = size / 2;
  const r = c - 34;

  // Ángulos: V=-90, A=0, R=90, K=180
  const axes: { key: keyof Vark; angle: number; color: string; label: string }[] = [
    { key: 'V', angle: -90, color: theme.varkV, label: 'Visual' },
    { key: 'A', angle: 0, color: theme.varkA, label: 'Auditivo' },
    { key: 'R', angle: 90, color: theme.varkR, label: 'Lectura' },
    { key: 'K', angle: 180, color: theme.varkK, label: 'Kinest.' },
  ];

  const pt = (angleDeg: number, radius: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: c + radius * Math.cos(a), y: c + radius * Math.sin(a) };
  };

  const grid = [0.25, 0.5, 0.75, 1].map((f) =>
    axes.map((ax) => { const p = pt(ax.angle, r * f); return `${p.x},${p.y}`; }).join(' '),
  );

  const valuePoints = axes
    .map((ax) => { const v = Math.max(0, Math.min(100, data[ax.key])) / 100; const p = pt(ax.angle, r * v); return `${p.x},${p.y}`; })
    .join(' ');

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {grid.map((g, i) => (
          <Polygon key={i} points={g} stroke={theme.borderGlass} strokeWidth={1} fill="none" />
        ))}
        {axes.map((ax) => {
          const p = pt(ax.angle, r);
          return <Line key={ax.key} x1={c} y1={c} x2={p.x} y2={p.y} stroke={theme.borderGlass} strokeWidth={1} />;
        })}
        <Polygon points={valuePoints} fill={theme.accentBlue + '40'} stroke={theme.accentBlue} strokeWidth={2} />
        {axes.map((ax) => {
          const v = Math.max(0, Math.min(100, data[ax.key])) / 100;
          const p = pt(ax.angle, r * v);
          return <Circle key={ax.key} cx={p.x} cy={p.y} r={4} fill={ax.color} />;
        })}
        {axes.map((ax) => {
          const p = pt(ax.angle, r + 16);
          return (
            <SvgText
              key={ax.key} x={p.x} y={p.y + 4}
              fill={theme.textSecondary} fontSize={11} fontFamily={fonts.bodyMedium}
              textAnchor="middle"
            >
              {ax.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

export function VarkBars({ data }: { data: Vark }) {
  const { theme } = useTheme();
  const dims: { key: keyof Vark; label: string; color: string }[] = [
    { key: 'V', label: 'Visual', color: theme.varkV },
    { key: 'A', label: 'Auditivo', color: theme.varkA },
    { key: 'R', label: 'Lectura', color: theme.varkR },
    { key: 'K', label: 'Kinestésico', color: theme.varkK },
  ];
  return (
    <View style={{ gap: 14 }}>
      {dims.map((d) => (
        <View key={d.key}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: theme.textPrimary, fontFamily: fonts.bodyMedium, fontSize: 13 }}>{d.label}</Text>
            <Text style={{ color: d.color, fontFamily: fonts.syne, fontSize: 14 }}>{Math.round(data[d.key])}%</Text>
          </View>
          <View style={{ height: 6, borderRadius: 99, backgroundColor: theme.bgGlassHover, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${Math.max(0, Math.min(100, data[d.key]))}%`, backgroundColor: d.color, borderRadius: 99 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
