// ─── Types generated from backend serializers (accounts app) ─────────────────

// UsuarioSerializer
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  rol: 'estudiante' | 'docente' | 'administrador';
  fecha_registro: string;
}

// RegistroSerializer (request payload)
export interface RegistroPayload {
  email: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'docente';
  password: string;
}

// LoginSerializer (request payload)
export interface LoginPayload {
  email: string;
  password: string;
}

// LoginSerializer (response)
export interface LoginResponse {
  access: string;
  refresh: string;
  usuario: Usuario;
  vark_completado: boolean;
}

// LogoutView (request payload)
export interface LogoutPayload {
  refresh: string;
}

// PerfilVARKSerializer
export interface PerfilVARK {
  puntaje_visual: number;
  puntaje_auditivo: number;
  puntaje_lectura: number;
  puntaje_kinestesico: number;
  test_completado: boolean;
  fecha_test: string | null;
  vector: { V: number; A: number; R: number; K: number };
  estilo_dominante: 'V' | 'A' | 'R' | 'K';
}

// VARKGenerarTestView (response)
export interface OpcionTest {
  id: string;   // 'a' | 'b' | 'c' | 'd'
  texto: string;
}

export interface PreguntaTest {
  id: number;
  enunciado: string;
  opciones: OpcionTest[];
}

export interface VARKTestResponse {
  sesion_id: number;
  fuente: string;
  total_preguntas: number;
  preguntas: PreguntaTest[];
  completado?: boolean; // present when test was already completed
}

// VARKCompletarTestView (request payload)
export interface CompletarTestPayload {
  sesion_id: number;
  respuestas: Record<string, string>; // { "1": "a", "2": "c", ... }
}

// VARKCompletarTestView (response)
export interface CompletarTestResponse {
  detail: string;
  perfil_vark: PerfilVARK;
}

// ─── Types from contenido app serializers (CU-09, CU-10) ─────────────────────

// TemaSimpleSerializer
export interface TemaSimple {
  id: number;
  nombre: string;
  orden: number;
  activo: boolean;
}

// SugerenciaIASerializer
export interface SugerenciaIA {
  id: number;
  titulo: string;
  url: string;
  descripcion: string;
  justificacion_pedagogica: string;
  tema: number;
  tema_nombre: string;
  categoria_vark: 'V' | 'A' | 'R' | 'K';
  nivel_complejidad: 'basico' | 'intermedio' | 'avanzado';
  tipo_formato: string;
  estado: string; // 'pendiente' | 'aprobado' | 'rechazado'
  estado_display: string;
  revisado_por: number | null;
  revisado_por_email: string | null;
  recurso_creado: number | null;
  fecha_sugerencia: string;
  fecha_revision: string | null;
}

// SolicitarSugerenciaIASerializer (request)
export interface SolicitarSugerenciaIAPayload {
  tema_id: number;
  categoria_vark: 'V' | 'A' | 'R' | 'K';
  nivel_complejidad: 'basico' | 'intermedio' | 'avanzado';
  cantidad: number;
}

// ─── Types from recomendacion app serializers (CU-12, CU-13) ─────────────────

// RecomendacionSerializer
export interface Recomendacion {
  id: number;
  recurso: number;
  recurso_titulo: string;
  recurso_url: string;
  recurso_tipo: string; // 'video' | 'articulo'
  recurso_tipo_display: string;
  recurso_categoria_vark: 'V' | 'A' | 'R' | 'K';
  recurso_nivel: 'basico' | 'intermedio' | 'avanzado';
  tema: number;
  tema_nombre: string;
  puntuacion: number;
  justificacion: string;
  vector_vark_snapshot: { V: number; A: number; R: number; K: number };
  fecha_recomendacion: string;
  vista: boolean;
}

// SolicitarRecomendacionSerializer (request)
export interface SolicitarRecomendacionPayload {
  tema_id: number;
  usar_groq?: boolean;
}

// ─── Types from analitica app serializers (CU-19, CU-20, CU-21, CU-22) ───────

// CU-19: Reporte docente
export interface RecursoEfectivo {
  'recurso__id': number;
  'recurso__titulo': string;
  'recurso__categoria_vark': 'V' | 'A' | 'R' | 'K';
  total_clics: number;
}

export interface EstudianteBajoEngagement {
  id: number;
  email: string;
  nombre: string;
}

export interface ReporteDocente {
  total_estudiantes: number;
  promedio_puntaje_quizzes: number;
  recursos_mas_efectivos: RecursoEfectivo[];
  estudiantes_bajo_engagement: EstudianteBajoEngagement[];
  distribucion_vark: { V: number; A: number; R: number; K: number };
}

// CU-20: Experimento A/B
export interface ExperimentoAB {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'finalizado';
  creado_por: number;
  creado_por_email: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  total_asignados: number;
}

export interface AsignarEstudiantesPayload {
  estudiante_ids: number[];
  grupo: 'experimental' | 'control';
}

export interface GrupoResultados {
  total: number;
  promedio_puntaje: number | null;
  total_clics: number;
}

export interface ResultadosExperimento {
  experimento: ExperimentoAB;
  resultados: {
    experimental: GrupoResultados;
    control: GrupoResultados;
  };
}

// CU-21: Export params (query params sent as GET request)
export interface ExportReporteParams {
  formato: 'csv' | 'pdf';
  fecha_inicio?: string;
  fecha_fin?: string;
  tema_id?: number;
}

// CU-22: Notificaciones
export interface NotificacionAPI {
  id: number;
  tipo: 'nuevo_recurso' | 'nuevo_quiz' | 'sistema';
  tipo_display: string;
  titulo: string;
  mensaje: string;
  recurso: number | null;
  recurso_titulo: string | null;
  leida: boolean;
  fecha: string;
}
