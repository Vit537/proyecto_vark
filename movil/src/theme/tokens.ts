// Tokens de diseño — réplica del sistema VARK web (glassmorphism dark cosmic + claro).

export type ThemeName = 'dark' | 'light';

export interface Theme {
  name: ThemeName;
  // Fondos
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgGlass: string;
  bgGlassHover: string;
  borderGlass: string;
  borderActive: string;
  // Acentos
  accentBlue: string;
  accentGlow: string;
  accentPurple: string;
  accentCyan: string;
  // VARK
  varkV: string;
  varkA: string;
  varkR: string;
  varkK: string;
  // Texto
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Estados
  success: string;
  warning: string;
  danger: string;
  info: string;
  // Fondo de figuritas
  doodleBg: string;
  doodleBlue: string;
  doodleWhite: string;
  doodleYellow: string;
  doodleOpacity: number;
  doodleVeil: number;
  // Glass blur (expo-blur)
  blurTint: 'dark' | 'light';
}

export const darkTheme: Theme = {
  name: 'dark',
  bgPrimary: '#050b1f',
  bgSecondary: '#0a1535',
  bgCard: 'rgba(10,20,55,0.85)',
  bgGlass: 'rgba(255,255,255,0.04)',
  bgGlassHover: 'rgba(255,255,255,0.07)',
  borderGlass: 'rgba(255,255,255,0.10)',
  borderActive: 'rgba(59,110,248,0.5)',
  accentBlue: '#3b6ef8',
  accentGlow: '#4f7fff',
  accentPurple: '#6c63ff',
  accentCyan: '#00d4ff',
  varkV: '#3b6ef8',
  varkA: '#a78bfa',
  varkR: '#00d4ff',
  varkK: '#00e676',
  textPrimary: '#ffffff',
  textSecondary: '#8892b0',
  textMuted: '#5a6680',
  success: '#00e676',
  warning: '#ffd740',
  danger: '#ff5252',
  info: '#00d4ff',
  doodleBg: '#060d20',
  doodleBlue: 'rgba(26,159,212,0.9)',
  doodleWhite: 'rgba(255,255,255,0.5)',
  doodleYellow: '#f0a500',
  doodleOpacity: 0.55,
  doodleVeil: 0.55,
  blurTint: 'dark',
};

export const lightTheme: Theme = {
  name: 'light',
  bgPrimary: '#eef2fb',
  bgSecondary: '#ffffff',
  bgCard: 'rgba(255,255,255,0.85)',
  bgGlass: 'rgba(20,40,90,0.04)',
  bgGlassHover: 'rgba(20,40,90,0.08)',
  borderGlass: 'rgba(20,40,90,0.14)',
  borderActive: 'rgba(59,110,248,0.5)',
  accentBlue: '#2f63ef',
  accentGlow: '#4f7fff',
  accentPurple: '#6c63ff',
  accentCyan: '#0bb6d6',
  varkV: '#2f63ef',
  varkA: '#7c5cf0',
  varkR: '#0bb6d6',
  varkK: '#08b85f',
  textPrimary: '#0b1735',
  textSecondary: '#4a5578',
  textMuted: '#8a94ad',
  success: '#08b85f',
  warning: '#d99500',
  danger: '#e23d3d',
  info: '#0bb6d6',
  doodleBg: '#eef2fb',
  doodleBlue: 'rgba(36,86,224,0.78)',
  doodleWhite: 'rgba(20,40,90,0.42)',
  doodleYellow: '#d99500',
  doodleOpacity: 0.9,
  doodleVeil: 0.28,
  blurTint: 'light',
};

export const fonts = {
  // Variables de familia (cargadas con @expo-google-fonts)
  syne: 'Syne_700Bold',
  syneExtra: 'Syne_800ExtraBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

export const radius = { sm: 8, md: 14, lg: 20, xl: 28 };

export const varkColor = (theme: Theme, k: 'V' | 'A' | 'R' | 'K') =>
  ({ V: theme.varkV, A: theme.varkA, R: theme.varkR, K: theme.varkK }[k]);
