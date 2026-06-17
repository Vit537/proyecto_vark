import { api } from './api';
import { PerfilVARK, Recomendacion, ValoracionPayload, ValoracionResponse } from '../types/api';

export async function getPerfilVARK(): Promise<PerfilVARK> {
  return api.get<PerfilVARK>('/api/accounts/vark/perfil/');
}

export async function getRecomendaciones(): Promise<Recomendacion[]> {
  return api.get<Recomendacion[]>('/api/recomendacion/mis-recomendaciones/');
}

export async function registrarValoracion(payload: ValoracionPayload): Promise<ValoracionResponse> {
  return api.post<ValoracionResponse>('/api/recomendacion/valoraciones/', payload);
}
