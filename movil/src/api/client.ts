import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Base URL del backend. En emulador Android, localhost del host es 10.0.2.2.
// Cambia `extra.apiUrl` en app.json o define EXPO_PUBLIC_API_URL.
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  'http://10.0.2.2:8000/api';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS);
}
export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH);
}
export async function setTokens(access: string, refresh: string) {
  await AsyncStorage.multiSet([[ACCESS, access], [REFRESH, refresh]]);
}
export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS, REFRESH]);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') throw new Error('Sin conexión con el servidor');
    throw e;
  }
  clearTimeout(timer);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({} as Record<string, unknown>));
    const message =
      (errorData as any)?.detail ??
      (errorData as any)?.message ??
      Object.values(errorData).flat().join(' ') ??
      `Error ${res.status}`;
    throw new Error(String(message));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
