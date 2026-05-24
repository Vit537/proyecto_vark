import { apiRequest } from './client';
import { Recomendacion, SolicitarRecomendacionPayload } from './types';

// ─── CU-12: Motor de recomendación CBF ───────────────────────────────────────

export function recomendarRecursos(
  payload: SolicitarRecomendacionPayload,
): Promise<Recomendacion[]> {
  return apiRequest<Recomendacion[]>('/recomendacion/recomendar/', {
    method: 'POST',
    body: payload,
  });
}

// ─── CU-13: Historial de recomendaciones ─────────────────────────────────────

export function misRecomendaciones(): Promise<Recomendacion[]> {
  return apiRequest<Recomendacion[]>('/recomendacion/mis-recomendaciones/');
}

export function marcarRecomendacionVista(pk: number): Promise<unknown> {
  return apiRequest<unknown>(`/recomendacion/${pk}/vista/`, { method: 'PATCH' });
}
