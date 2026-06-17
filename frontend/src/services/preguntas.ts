import { api } from './api';
import { Pregunta } from '../types/api';

export interface GetPreguntasParams {
  tema?: string;
  dificultad?: string;
}

export async function getPreguntas(params?: GetPreguntasParams): Promise<Pregunta[]> {
  const queryParams: Record<string, string> = {};
  if (params?.tema) queryParams.tema = params.tema;
  if (params?.dificultad) queryParams.dificultad = params.dificultad;
  
  return api.get<Pregunta[]>('/api/contenido/preguntas/', queryParams);
}

export interface OpcionInput {
  texto: string;
  es_correcta: boolean;
}

export interface CreatePreguntaInput {
  enunciado: string;
  tema: number;
  subtema?: number | null;
  nivel_dificultad: 'facil' | 'media' | 'dificil';
  activo?: boolean;
  opciones: OpcionInput[];
}

export async function createPregunta(data: CreatePreguntaInput): Promise<Pregunta> {
  return api.post<Pregunta>('/api/contenido/preguntas/', {
    ...data,
    activo: data.activo ?? true,
  });
}

export async function updatePregunta(id: number, data: Partial<CreatePreguntaInput>): Promise<Pregunta> {
  return api.put<Pregunta>(`/api/contenido/preguntas/${id}/`, data);
}

export async function deletePregunta(id: number): Promise<void> {
  return api.delete<void>(`/api/contenido/preguntas/${id}/`);
}
