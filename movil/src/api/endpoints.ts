import { apiRequest } from './client';
import type {
  LoginPayload, LoginResponse, Usuario, MeUpdatePayload, PerfilVARK,
  VARKTestResponse, CompletarTestPayload, CompletarTestResponse,
  DashboardEstudiante, Recomendacion, ValoracionPayload,
  Tema, Recurso, QuizPreguntasResponse, RespuestaQuizPayload, ResultadoQuiz,
  HistorialPerfilVARK,
} from './types';

// ─── Accounts ───
export const login = (payload: LoginPayload) =>
  apiRequest<LoginResponse>('/accounts/login/', { method: 'POST', body: payload, auth: false });

export const logout = (refresh: string) =>
  apiRequest<{ detail: string }>('/accounts/logout/', { method: 'POST', body: { refresh } });

export const me = () => apiRequest<Usuario>('/accounts/me/');

export const actualizarMiPerfil = (payload: MeUpdatePayload) =>
  apiRequest<Usuario>('/accounts/me/', { method: 'PATCH', body: payload });

export const cambiarMiPassword = (password_actual: string, password_nueva: string) =>
  apiRequest<{ detail: string }>('/accounts/me/cambiar-password/', {
    method: 'POST', body: { password_actual, password_nueva },
  });

// ─── Test VARK ───
export const generarTestVARK = () => apiRequest<VARKTestResponse>('/accounts/vark/test/');

export const completarTestVARK = (payload: CompletarTestPayload) =>
  apiRequest<CompletarTestResponse>('/accounts/vark/completar/', { method: 'POST', body: payload });

export const perfilVARK = () => apiRequest<PerfilVARK>('/accounts/vark/perfil/');

// ─── Analítica ───
export const dashboardEstudiante = () =>
  apiRequest<DashboardEstudiante>('/analitica/dashboard/');

// ─── Recomendación ───
export const misRecomendaciones = () =>
  apiRequest<Recomendacion[]>('/recomendacion/mis-recomendaciones/');

export const valorarRecurso = (payload: ValoracionPayload) =>
  apiRequest('/recomendacion/valoraciones/', { method: 'POST', body: payload });

export const historialPerfilVARK = () =>
  apiRequest<HistorialPerfilVARK[]>('/recomendacion/perfil/historial/');

// ─── Contenido ───
export const listarTemasCompletos = () =>
  apiRequest<Tema[]>('/contenido/temas/');

export const listarRecursos = () =>
  apiRequest<Recurso[]>('/contenido/recursos/');

export const obtenerPreguntasQuiz = (temaPk: number) =>
  apiRequest<QuizPreguntasResponse>(`/contenido/quiz/${temaPk}/preguntas/`);

export const responderQuiz = (payload: RespuestaQuizPayload) =>
  apiRequest<ResultadoQuiz>('/contenido/quiz/responder/', { method: 'POST', body: payload });
