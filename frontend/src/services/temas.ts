import { api } from './api';
import { Tema, Subtema } from '../types/api';

export async function getTemas(): Promise<Tema[]> {
  return api.get<Tema[]>('/api/contenido/temas/');
}

export async function createTema(data: { nombre: string; descripcion: string; orden?: number; activo?: boolean }): Promise<Tema> {
  return api.post<Tema>('/api/contenido/temas/', {
    ...data,
    orden: data.orden ?? 1,
    activo: data.activo ?? true,
  });
}

export async function updateTema(id: number, data: { nombre: string; descripcion: string; orden?: number; activo?: boolean }): Promise<Tema> {
  return api.put<Tema>(`/api/contenido/temas/${id}/`, data);
}

export async function deleteTema(id: number): Promise<void> {
  return api.delete<void>(`/api/contenido/temas/${id}/`);
}

export async function createSubtema(temaPk: number, data: { nombre: string; descripcion: string; orden?: number; activo?: boolean }): Promise<Subtema> {
  return api.post<Subtema>(`/api/contenido/temas/${temaPk}/subtemas/`, {
    ...data,
    orden: data.orden ?? 1,
    activo: data.activo ?? true,
  });
}
