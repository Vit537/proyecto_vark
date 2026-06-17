import { api } from './api';
import { Recurso } from '../types/api';

export async function getRecursos(params?: Record<string, string>): Promise<Recurso[]> {
  return api.get<Recurso[]>('/api/contenido/recursos/', params);
}

export async function createRecurso(data: Partial<Recurso>): Promise<Recurso> {
  return api.post<Recurso>('/api/contenido/recursos/', data);
}

export async function updateRecurso(id: number, data: Partial<Recurso>): Promise<Recurso> {
  return api.put<Recurso>(`/api/contenido/recursos/${id}/`, data);
}

export async function deleteRecurso(id: number): Promise<void> {
  return api.delete<void>(`/api/contenido/recursos/${id}/`);
}
