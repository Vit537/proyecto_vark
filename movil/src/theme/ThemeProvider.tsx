import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, Theme, ThemeName } from './tokens';

const STORAGE_KEY = 'vark_theme';

interface ThemeCtx {
  theme: Theme;
  name: ThemeName;
  toggleTheme: () => void;
  setTheme: (n: ThemeName) => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: darkTheme,
  name: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  ready: false,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<ThemeName>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => { if (v === 'light' || v === 'dark') setName(v); })
      .finally(() => setReady(true));
  }, []);

  const setTheme = useCallback((n: ThemeName) => {
    setName(n);
    AsyncStorage.setItem(STORAGE_KEY, n).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setName((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const theme = name === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, name, toggleTheme, setTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}
