// Tipos del backend (subconjunto necesario para la app del estudiante).
// Espejo de frontend/src/lib/api/types.ts.

export type Rol = 'estudiante' | 'docente' | 'administrador';
export type EstiloVARK = 'V' | 'A' | 'R' | 'K';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  rol: Rol;
  foto?: string;
  carrera?: string;
  semestre?: string;
  fecha_registro: string;
}

export interface LoginPayload { email: string; password: string; }

export interface LoginResponse {
  access: string;
  refresh: string;
  usuario: Usuario;
  vark_completado: boolean;
}

export interface MeUpdatePayload {
  nombre?: string;
  apellido?: string;
  email?: string;
  foto?: string;
  carrera?: string;
  semestre?: string;
}

export interface PerfilVARK {
  puntaje_visual: number;
  puntaje_auditivo: number;
  puntaje_lectura: number;
  puntaje_kinestesico: number;
  test_completado: boolean;
  fecha_test: string | null;
  vector: { V: number; A: number; R: number; K: number };
  estilo_dominante: EstiloVARK;
}

// ─── Test VARK ───
export interface OpcionTest { id: string; texto: string; }
export interface PreguntaTest { id: number; enunciado: string; opciones: OpcionTest[]; }
export interface VARKTestResponse {
  sesion_id: number;
  fuente: string;
  total_preguntas: number;
  preguntas: PreguntaTest[];
  completado?: boolean;
}
export interface CompletarTestPayload {
  sesion_id: number;
  respuestas: Record<string, string>;
}
export interface CompletarTestResponse {
  detail: string;
  perfil_vark: PerfilVARK;
}

// ─── Dashboard ───
export interface DashboardEstudiante {
  perfil_vark: { V: number; A: number; R: number; K: number };
  estilo_dominante: string;
  evolucion_semanal: { semana: string; V: number; A: number; R: number; K: number }[];
  progreso_por_tema: { tema: string; progreso: number }[];
  total_recursos_vistos: number;
  total_quizzes_realizados: number;
}

// ─── Recomendaciones ───
export interface Recomendacion {
  id: number;
  recurso: number;
  recurso_titulo: string;
  recurso_url: string;
  recurso_tipo: string;
  recurso_tipo_display: string;
  recurso_categoria_vark: EstiloVARK;
  recurso_nivel: 'basico' | 'intermedio' | 'avanzado';
  tema: number;
  tema_nombre: string;
  puntuacion: number;
  justificacion: string;
  vector_vark_snapshot: { V: number; A: number; R: number; K: number };
  fecha_recomendacion: string;
  vista: boolean;
}

export interface ValoracionPayload {
  recurso: number;
  util: boolean;
}

// ─── Temas / Recursos ───
export interface Subtema { id: number; nombre: string; descripcion: string; orden: number; activo: boolean; }
export interface Tema {
  id: number;
  nombre: string;
  descripcion: string;
  orden: number;
  activo: boolean;
  subtemas: Subtema[];
}

export type CategoriaVARK = 'V' | 'A' | 'R' | 'K';
export type NivelComplejidad = 'basico' | 'intermedio' | 'avanzado';
export type TipoFormato = 'video' | 'articulo' | 'ejercicio' | 'documento';

export interface Recurso {
  id: number;
  titulo: string;
  url: string;
  descripcion: string;
  tema: number;
  tema_nombre: string;
  categoria_vark: CategoriaVARK;
  nivel_complejidad: NivelComplejidad;
  tipo_formato: TipoFormato;
  activo: boolean;
}

// ─── Quiz ───
export interface OpcionPreguntaFrontend { id: number; texto: string; }
export interface PreguntaFrontend {
  id: number;
  enunciado: string;
  tema_nombre: string;
  nivel_dificultad: string;
  opciones: OpcionPreguntaFrontend[];
}
export interface QuizPreguntasResponse {
  tema_id: number;
  total_preguntas: number;
  preguntas: PreguntaFrontend[];
}
export interface RespuestaQuizPayload {
  tema_id: number;
  respuestas: { pregunta_id: number; opcion_id: number }[];
}
export interface ResultadoQuiz {
  id: number;
  tema: number;
  tema_nombre: string;
  puntaje: number;
  puntaje_porcentaje: string;
  total_preguntas: number;
  respuestas_correctas: number;
  fecha_realizacion: string;
}

// ─── Historial perfil ───
export interface HistorialPerfilVARK {
  id: number;
  vector: { V: number; A: number; R: number; K: number };
  fecha: string;
  motivo?: string;
}
