import { api } from './api';
import { EventoClickstreamPayload, EventoClickstreamResponse } from '../types/api';

export async function registrarEventoClickstream(payload: EventoClickstreamPayload): Promise<EventoClickstreamResponse> {
  return api.post<EventoClickstreamResponse>('/api/recomendacion/clickstream/', payload);
}
