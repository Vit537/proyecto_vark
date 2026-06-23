import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { me as fetchMe, logout as apiLogout } from '@/api/endpoints';
import { getRefreshToken, clearTokens, setTokens } from '@/api/client';
import type { Usuario } from '@/api/types';

interface AuthState {
  user: Usuario | null;
  loading: boolean;
  varkCompletado: boolean;
  signIn: (access: string, refresh: string, usuario: Usuario, vark: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  setVarkCompletado: (v: boolean) => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  varkCompletado: false,
  signIn: async () => {},
  signOut: async () => {},
  refresh: async () => {},
  setVarkCompletado: () => {},
});

export const useAuth = () => useContext(AuthContext);

const USER_KEY = 'vark_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [varkCompletado, setVark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(USER_KEY);
        if (cached) setUser(JSON.parse(cached));
        const u = await fetchMe();
        setUser(u);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch {
        await clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (access: string, refresh: string, usuario: Usuario, vark: boolean) => {
    await setTokens(access, refresh);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUser(usuario);
    setVark(vark);
  }, []);

  const signOut = useCallback(async () => {
    const r = await getRefreshToken();
    try { if (r) await apiLogout(r); } catch { /* nunca bloquear */ }
    await clearTokens();
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const u = await fetchMe();
      setUser(u);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, varkCompletado, signIn, signOut, refresh, setVarkCompletado: setVark }}
    >
      {children}
    </AuthContext.Provider>
  );
}
