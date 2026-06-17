// ─── CU-04: Temas y Subtemas ────────────────────────────────────────────────
export interface Subtema {
  id: number;
  nombre: string;
  descripcion: string;
  orden: number;
  activo: boolean;
}

export interface Tema {
  id: number;
  nombre: string;
  descripcion: string;
  orden: number;
  activo: boolean;
  subtemas?: Subtema[];
}

// ─── CU-05: Banco de Preguntas ──────────────────────────────────────────────
export interface OpcionPregunta {
  id?: number;
  texto: string;
  es_correcta: boolean;
}

export interface Pregunta {
  id: number;
  enunciado: string;
  tema: number;
  tema_nombre?: string;
  subtema?: number | null;
  subtema_nombre?: string;
  nivel_dificultad: 'facil' | 'media' | 'dificil';
  activo: boolean;
  opciones: OpcionPregunta[];
  fecha_creacion?: string;
}

// ─── CU-06: Configuración del Motor ──────────────────────────────────────────
export interface ConfiguracionMotor {
  factor_decaimiento: number;
  umbral_similitud: number;
  max_recomendaciones: number;
  peso_valoracion_util: number;
  dias_ventana_clickstream: number;
  actualizado_en?: string;
}

// ─── CU-07: Quizzes ──────────────────────────────────────────────────────────
export interface OpcionQuiz {
  id: string; // En el frontend es string, en backend es id (number)
  texto: string;
}

export interface PreguntaQuiz {
  id: number;
  enunciado: string;
  tema_nombre?: string;
  nivel_dificultad?: string;
  opciones: OpcionQuiz[];
}

export interface QuizObtenerPreguntasResponse {
  tema_id: number;
  total_preguntas: number;
  preguntas: PreguntaQuiz[];
}

export interface RespuestaQuizItem {
  pregunta_id: number;
  opcion_id: number;
}

export interface RespuestaQuizPayload {
  tema_id: number;
  respuestas: RespuestaQuizItem[];
}

export interface ResultadoQuizDetalle {
  pregunta_id: number;
  opcion_id: number;
  es_correcta: boolean;
}

export interface ResultadoQuiz {
  id: number;
  tema: number;
  tema_nombre: string;
  puntaje: number;
  puntaje_porcentaje: string;
  total_preguntas: number;
  respuestas_correctas: number;
  respuestas_json: ResultadoQuizDetalle[];
  fecha_realizacion: string;
}

// ─── CU-08 / CU-11: Recursos ──────────────────────────────────────────────────
export interface Recurso {
  id: number;
  titulo: string;
  url: string;
  descripcion: string;
  tema: number;
  tema_nombre?: string;
  subtema?: number | null;
  subtema_nombre?: string;
  categoria_vark: 'V' | 'A' | 'R' | 'K';
  categoria_vark_display?: string;
  nivel_complejidad: 'basico' | 'intermedio' | 'avanzado';
  nivel_complejidad_display?: string;
  tipo_formato: 'video' | 'articulo' | 'ejercicio' | 'documento';
  tipo_formato_display?: string;
  activo: boolean;
  sugerido_por_ia?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ─── CU-14: Valoraciones y Recomendaciones ─────────────────────────────────────
export interface ValoracionPayload {
  recurso: number;
  valoracion: 'util' | 'no_util';
  comentario: string;
}

export interface ValoracionResponse {
  id: number;
  recurso: number;
  recurso_titulo: string;
  valoracion: 'util' | 'no_util';
  comentario: string;
  fecha: string;
}

export interface PerfilVARK {
  puntaje_visual: number;
  puntaje_auditivo: number;
  puntaje_lectura: number;
  puntaje_kinestesico: number;
  test_completado: boolean;
  fecha_test: string | null;
  vector: {
    V: number;
    A: number;
    R: number;
    K: number;
  };
  estilo_dominante: 'V' | 'A' | 'R' | 'K';
}

export interface Recomendacion {
  id: number;
  recurso: number;
  recurso_titulo: string;
  recurso_url: string;
  recurso_tipo: 'video' | 'articulo' | 'ejercicio' | 'documento';
  recurso_tipo_display: string;
  recurso_categoria_vark: 'V' | 'A' | 'R' | 'K';
  recurso_nivel: 'basico' | 'intermedio' | 'avanzado';
  tema: number;
  tema_nombre: string;
  puntuacion: number;
  justificacion: string;
  vector_vark_snapshot: {
    V: number;
    A: number;
    R: number;
    K: number;
  };
  fecha_recomendacion: string;
  vista: boolean;
}

// ─── CU-15 / CU-16 / CU-17 / CU-18: Clickstream, Dashboard & Historial ─────────
export interface EventoClickstreamPayload {
  recurso: number;
  tipo_evento: 'clic' | 'permanencia' | 'retorno' | 'cierre';
  duracion_segundos?: number;
}

export interface EventoClickstreamResponse {
  id: number;
  recurso: number;
  tipo_evento: 'clic' | 'permanencia' | 'retorno' | 'cierre';
  duracion_segundos?: number;
  timestamp: string;
}

export interface EvolucionPunto {
  fecha: string;
  origen: string;
  V: number;
  A: number;
  R: number;
  K: number;
}

export interface ProgresoTema {
  tema_id: number;
  tema: string;
  puntaje_promedio: number;
  quizzes_realizados: number;
}

export interface DashboardData {
  perfil_vark: {
    V: number;
    A: number;
    R: number;
    K: number;
  };
  estilo_dominante: 'V' | 'A' | 'R' | 'K' | 'N/A';
  evolucion_semanal: EvolucionPunto[];
  progreso_por_tema: ProgresoTema[];
  total_recursos_vistos: number;
  total_quizzes_realizados: number;
}

export interface HistorialVarkDetalle {
  id: number;
  fecha: string;
  origen: string;
  vector_anterior: { V: number; A: number; R: number; K: number };
  vector_nuevo: { V: number; A: number; R: number; K: number };
  delta: { V: number; A: number; R: number; K: number };
}


