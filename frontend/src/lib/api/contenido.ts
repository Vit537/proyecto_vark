import { apiRequest } from './client';
import { TemaSimple, SugerenciaIA, SolicitarSugerenciaIAPayload } from './types';

// ─── CU-04: Temas ─────────────────────────────────────────────────────────────

export function listarTemas(): Promise<TemaSimple[]> {
  return apiRequest<TemaSimple[]>('/contenido/temas/');
}

// ─── CU-09: Sugerir recursos con IA ──────────────────────────────────────────

export function sugerirRecursosIA(
  payload: SolicitarSugerenciaIAPayload,
): Promise<SugerenciaIA[]> {
  return apiRequest<SugerenciaIA[]>('/contenido/recursos/sugerir/', {
    method: 'POST',
    body: payload,
  });
}

// ─── CU-10: Gestionar sugerencias IA ─────────────────────────────────────────

export function listarSugerencias(estado?: string): Promise<SugerenciaIA[]> {
  const query = estado ? `?estado=${estado}` : '';
  return apiRequest<SugerenciaIA[]>(`/contenido/sugerencias/${query}`);
}

export function aprobarSugerencia(pk: number): Promise<unknown> {
  return apiRequest<unknown>(`/contenido/sugerencias/${pk}/aprobar/`, { method: 'POST' });
}

export function rechazarSugerencia(pk: number): Promise<unknown> {
  return apiRequest<unknown>(`/contenido/sugerencias/${pk}/rechazar/`, { method: 'POST' });
}
