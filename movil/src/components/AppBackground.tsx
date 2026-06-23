import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { G, Circle, Path, Rect, Line, Polygon, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Fondo de "figuritas" de la app (port del BackgroundPattern web).
 * Doodles educativos sutiles + velo para legibilidad. Tema-aware.
 */
export default function AppBackground() {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const b = theme.doodleBlue;
  const w = theme.doodleWhite;
  const y = theme.doodleYellow;
  const sw = 1.3;

  const veilColors =
    theme.name === 'dark'
      ? ['transparent', theme.bgPrimary] as const
      : ['transparent', theme.bgPrimary] as const;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.doodleBg }]} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 420 900"
        preserveAspectRatio="xMidYMid slice"
        opacity={theme.doodleOpacity}
      >
        {/* Diana / círculos concéntricos */}
        <G opacity={0.6} x={40} y={60}>
          <Circle cx={26} cy={26} r={24} stroke={w} strokeWidth={sw} fill="none" />
          <Circle cx={26} cy={26} r={17} stroke={w} strokeWidth={sw} fill="none" />
          <Circle cx={26} cy={26} r={9} stroke={w} strokeWidth={sw} fill="none" />
          <Circle cx={26} cy={26} r={3} stroke={w} strokeWidth={sw} fill="none" />
        </G>
        {/* Cerebro (gota) */}
        <G opacity={0.7} x={300} y={40}>
          <Path d="M12 0 Q20 10 20 26 L12 33 L4 26 Q4 10 12 0Z" stroke={b} strokeWidth={sw} fill="none" />
          <Circle cx={12} cy={16} r={5} stroke={b} strokeWidth={sw} fill="none" />
        </G>
        {/* Nube */}
        <G opacity={0.7} x={150} y={30}>
          <Path d="M10 22 Q3 22 3 15 Q3 8 10 8 Q11 3 18 3 Q26 3 26 10 Q33 10 33 17 Q33 22 26 22Z" stroke={b} strokeWidth={sw} fill="none" />
        </G>
        {/* Libro */}
        <G opacity={0.6} x={40} y={300}>
          <Path d="M2 4 Q2 2 4 2 L18 2 L18 34 Q10 30 2 34Z" stroke={w} strokeWidth={sw} fill="none" />
          <Path d="M18 2 L32 2 Q34 2 34 4 L34 34 Q26 30 18 34Z" stroke={w} strokeWidth={sw} fill="none" />
          <Line x1={6} y1={10} x2={16} y2={10} stroke={w} strokeWidth={1} />
          <Line x1={20} y1={10} x2={30} y2={10} stroke={w} strokeWidth={1} />
        </G>
        {/* Bombilla / idea */}
        <G opacity={0.7} x={320} y={300}>
          <Circle cx={16} cy={14} r={12} stroke={y} strokeWidth={sw} fill="none" />
          <Path d="M10 24 Q10 30 16 32 Q22 30 22 24" stroke={y} strokeWidth={sw} fill="none" />
          <Line x1={13} y1={32} x2={13} y2={36} stroke={y} strokeWidth={sw} />
          <Line x1={19} y1={32} x2={19} y2={36} stroke={y} strokeWidth={sw} />
        </G>
        {/* Átomo */}
        <G opacity={0.55} x={180} y={250}>
          <Circle cx={22} cy={22} r={5} stroke={b} strokeWidth={sw} fill="none" />
          <Ellipse cx={22} cy={22} rx={20} ry={9} stroke={b} strokeWidth={1} fill="none" />
          <Ellipse cx={22} cy={22} rx={20} ry={9} stroke={b} strokeWidth={1} fill="none" rotation={60} originX={22} originY={22} />
          <Ellipse cx={22} cy={22} rx={20} ry={9} stroke={b} strokeWidth={1} fill="none" rotation={120} originX={22} originY={22} />
        </G>
        {/* Gráfico de barras */}
        <G opacity={0.6} x={50} y={560}>
          <Rect x={0} y={22} width={9} height={20} rx={2} stroke={b} strokeWidth={sw} fill="none" />
          <Rect x={13} y={10} width={9} height={32} rx={2} stroke={b} strokeWidth={sw} fill="none" />
          <Rect x={26} y={16} width={9} height={26} rx={2} stroke={b} strokeWidth={sw} fill="none" />
          <Rect x={39} y={6} width={9} height={36} rx={2} stroke={b} strokeWidth={sw} fill="none" />
        </G>
        {/* Estrella */}
        <G opacity={0.6} x={300} y={560}>
          <Polygon points="20,0 24,14 38,14 27,22 31,36 20,28 9,36 13,22 2,14 16,14" stroke={w} strokeWidth={sw} fill="none" />
        </G>
        {/* Lupa */}
        <G opacity={0.6} x={120} y={620}>
          <Circle cx={16} cy={16} r={13} stroke={w} strokeWidth={sw} fill="none" />
          <Line x1={26} y1={26} x2={36} y2={36} stroke={w} strokeWidth={1.8} />
        </G>
        {/* Reloj */}
        <G opacity={0.6} x={330} y={640}>
          <Circle cx={20} cy={20} r={18} stroke={w} strokeWidth={sw} fill="none" />
          <Line x1={20} y1={8} x2={20} y2={20} stroke={w} strokeWidth={1.4} />
          <Line x1={20} y1={20} x2={28} y2={26} stroke={w} strokeWidth={1.4} />
        </G>
        {/* Triángulos sueltos */}
        <G opacity={0.5} x={210} y={120}>
          <Polygon points="16,0 32,28 0,28" stroke={w} strokeWidth={1.1} fill="none" />
        </G>
        <G opacity={0.5} x={260} y={760}>
          <Polygon points="16,0 32,28 0,28" stroke={b} strokeWidth={1.1} fill="none" />
        </G>

        {/* Puntos */}
        <Circle cx={110} cy={45} r={3} fill={b} opacity={0.5} />
        <Circle cx={230} cy={90} r={2.5} fill={w} />
        <Circle cx={360} cy={150} r={3} fill={b} opacity={0.45} />
        <Circle cx={70} cy={210} r={2.5} fill={w} />
        <Circle cx={280} cy={430} r={3} fill={b} opacity={0.45} />
        <Circle cx={120} cy={470} r={2.5} fill={w} />
        <Circle cx={390} cy={520} r={3} fill={b} opacity={0.4} />
        <Circle cx={40} cy={700} r={3} fill={y} opacity={0.5} />
        <Circle cx={200} cy={840} r={2.5} fill={w} />
        <Circle cx={360} cy={820} r={3} fill={b} opacity={0.45} />
      </Svg>

      {/* Velo para legibilidad */}
      <LinearGradient
        colors={veilColors}
        start={{ x: 0.7, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: theme.doodleVeil }]}
      />
    </View>
  );
}
