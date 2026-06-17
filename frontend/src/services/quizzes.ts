import { api } from './api';
import { QuizObtenerPreguntasResponse, RespuestaQuizPayload, ResultadoQuiz } from '../types/api';

export async function getQuizPreguntas(temaId: number): Promise<QuizObtenerPreguntasResponse> {
  return api.get<QuizObtenerPreguntasResponse>(`/api/contenido/quiz/${temaId}/preguntas/`);
}

export async function responderQuiz(payload: RespuestaQuizPayload): Promise<ResultadoQuiz> {
  return api.post<ResultadoQuiz>('/api/contenido/quiz/responder/', payload);
}

export async function getQuizHistorial(): Promise<ResultadoQuiz[]> {
  return api.get<ResultadoQuiz[]>('/api/contenido/quiz/historial/');
}
