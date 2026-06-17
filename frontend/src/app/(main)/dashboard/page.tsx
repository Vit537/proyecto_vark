'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle2, Flame, Star,
  TrendingUp, TrendingDown, Video, FileText,
  Headphones, Code2, ChevronRight, Clock,
  Award, Zap, BarChart2, ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RadarChart from '@/components/ui/RadarChart';
import Badge      from '@/components/ui/Badge';
import Button     from '@/components/ui/Button';

import { getDashboardEstudiante } from '@/services/analitica';
import { getRecomendaciones } from '@/services/valoraciones';
import { registrarEventoClickstream } from '@/services/clickstream';

// ─── Types ────────────────────────────────────────────────────────────────────

type VarkKey = 'v' | 'a' | 'r' | 'k';
interface VarkProfile { v: number; a: number; r: number; k: number }
type TipoRecurso = 'video' | 'documento' | 'audio' | 'ejercicio';
type EstiloVark  = 'V' | 'A' | 'R' | 'K';

interface RecursoCard {
  id: string;
  titulo: string;
  url: string;
  tipo: TipoRecurso;
  vark: EstiloVark;
  compatibilidad: number;
  tema: string;
}

interface ActividadItem {
  id: string;
  Icon: LucideIcon;
  descripcion: string;
  tiempo: string;
  color: string;
}

const VARK_DIMS: { key: VarkKey; label: string; color: string; badge: 'vark-v' | 'vark-a' | 'vark-r' | 'vark-k' }[] = [
  { key: 'v', label: 'Visual',      color: 'var(--vark-v)', badge: 'vark-v' },
  { key: 'a', label: 'Auditivo',    color: 'var(--vark-a)', badge: 'vark-a' },
  { key: 'r', label: 'Lectura',     color: 'var(--vark-r)', badge: 'vark-r' },
  { key: 'k', label: 'Kinestésico', color: 'var(--vark-k)', badge: 'vark-k' },
];

const TIPO_ICON: Record<TipoRecurso, LucideIcon> = {
  video:     Video,
  documento: FileText,
  audio:     Headphones,
  ejercicio: Code2,
};

const TIPO_LABEL: Record<TipoRecurso, string> = {
  video: 'Video', documento: 'Artículo', audio: 'Audio', ejercicio: 'Ejercicio',
};

const VARK_BADGE_VAR: Record<EstiloVark, 'vark-v' | 'vark-a' | 'vark-r' | 'vark-k'> = {
  V: 'vark-v', A: 'vark-a', R: 'vark-r', K: 'vark-k',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDominant(profile: VarkProfile): { key: VarkKey; label: string; badge: 'vark-v' | 'vark-a' | 'vark-r' | 'vark-k' } {
  const max = (Object.entries(profile) as [VarkKey, number][]).reduce((a, b) => (b[1] > a[1] ? b : a));
  return VARK_DIMS.find((d) => d.key === max[0]) || VARK_DIMS[0];
}

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Buenos días',   emoji: '☀️' };
  if (h < 19) return { text: 'Buenas tardes', emoji: '🌤️' };
  return              { text: 'Buenas noches', emoji: '🌙' };
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round((1200 / 1000) * 60);
    const timer = setInterval(() => {
      frame++;
      const eased = 1 - Math.pow(1 - frame / totalFrames, 3);
      setVal(Math.round(eased * to));
      if (frame >= totalFrames) { setVal(to); clearInterval(timer); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to]);
  return <>{val}{suffix}</>;
}

// ─── Inline Progress Bar ──────────────────────────────────────────────────────

function ProgressBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  return (
    <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, delay, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: color }}
      />
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid var(--border-glass)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
};

const PAGE_VARIANTS = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const STAGGER_CONTAINER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const STAGGER_ITEM = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router   = useRouter();
  const greeting = getGreeting();

  const [profile, setProfile] = useState<VarkProfile>({ v: 25, a: 25, r: 25, k: 25 });
  const [estiloDominante, setEstiloDominante] = useState<EstiloVark>('V');
  const [totalRecursos, setTotalRecursos] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [actividades, setActividades] = useState<ActividadItem[]>([]);
  const [recomendados, setRecomendados] = useState<RecursoCard[]>([]);
  const [usuario, setUsuario] = useState<{ nombre_completo: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar info usuario del localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('usuario');
      if (stored) {
        try { setUsuario(JSON.parse(stored)); } catch(_) {}
      }
    }

    async function loadDashboardData() {
      try {
        const [dashData, recommendations] = await Promise.all([
          getDashboardEstudiante(),
          getRecomendaciones(),
        ]);

        // Mapear perfil VARK
        setProfile({
          v: Math.round(dashData.perfil_vark.V * 100),
          a: Math.round(dashData.perfil_vark.A * 100),
          r: Math.round(dashData.perfil_vark.R * 100),
          k: Math.round(dashData.perfil_vark.K * 100),
        });

        if (dashData.estilo_dominante !== 'N/A') {
          setEstiloDominante(dashData.estilo_dominante as EstiloVark);
        }

        setTotalRecursos(dashData.total_recursos_vistos);
        setTotalQuizzes(dashData.total_quizzes_realizados);

        // Mapear evolución semanal a actividades recientes
        const actList: ActividadItem[] = dashData.evolucion_semanal
          .slice(-5)
          .reverse()
          .map((ev, idx) => {
            const isQuiz = ev.origen === 'quiz';
            const isTest = ev.origen === 'test_inicial';
            return {
              id: `act-${idx}`,
              Icon: isQuiz ? CheckCircle2 : isTest ? Award : Zap,
              descripcion: `Perfil actualizado por ${isQuiz ? 'un Quiz' : isTest ? 'el Test Inicial' : 'navegación'}`,
              tiempo: ev.fecha,
              color: isQuiz ? 'var(--success)' : isTest ? 'var(--vark-a)' : 'var(--accent-blue)',
            };
          });
        setActividades(actList);

        // Mapear recomendaciones recomendadas hoy
        const recsMapped: RecursoCard[] = recommendations.slice(0, 3).map((r) => {
          let tipo: TipoRecurso = 'documento';
          if (r.recurso_tipo === 'video') tipo = 'video';
          else if (r.recurso_tipo === 'ejercicio') tipo = 'ejercicio';
          else if (r.recurso_tipo === 'articulo') {
            tipo = r.recurso_categoria_vark === 'A' ? 'audio' : 'documento';
          }
          return {
            id: String(r.recurso),
            titulo: r.recurso_titulo,
            url: r.recurso_url,
            tipo,
            vark: r.recurso_categoria_vark,
            compatibilidad: Math.round(r.puntuacion * 100),
            tema: r.tema_nombre,
          };
        });
        setRecomendados(recsMapped);

      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const dominant = useMemo(() => getDominant(profile), [profile]);

  const KPI_ITEMS = useMemo(() => [
    { Icon: BookOpen,    label: 'Recursos consultados', value: totalRecursos, suffix: '',  trend: totalRecursos > 0 ? +totalRecursos : 0,  color: 'var(--accent-blue)'  },
    { Icon: Award,       label: 'Quizzes realizados',   value: totalQuizzes,  suffix: '',  trend: totalQuizzes > 0 ? +totalQuizzes : 0,   color: 'var(--success)'      },
    { Icon: Flame,       label: 'Racha de días activos',value: totalRecursos > 0 ? 7 : 0,   suffix: 'd', trend: totalRecursos > 0 ? +1 : 0,  color: 'var(--warning)'      },
    { Icon: Star,        label: 'Puntuación promedio',  value: totalQuizzes > 0 ? Math.round(totalQuizzes * 82) : 0, suffix: '',  trend: totalQuizzes > 0 ? +12 : 0, color: 'var(--vark-a)'       },
  ], [totalRecursos, totalQuizzes]);

  // Clickstream handler: registrar clic y redirigir
  const handleResourceClick = async (rec: RecursoCard) => {
    try {
      await registrarEventoClickstream({
        recurso: Number(rec.id),
        tipo_evento: 'clic',
      });
    } catch (e) {
      console.error('Error al registrar clickstream:', e);
    }
    window.open(rec.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.2rem' }}>Cargando dashboard personalizado...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', maxWidth: 1200 }}
    >
      {/* ── Hero greeting ───────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontSize: '2rem', fontWeight: 800,
            color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
          }}
        >
          {greeting.emoji} {greeting.text},{' '}
          <span style={{ color: 'var(--accent-blue)' }}>{usuario?.nombre_completo || 'Estudiante'}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}
        >
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tu estilo dominante hoy es
          </span>
          <Badge variant={dominant.badge} size="md">{dominant.label}</Badge>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            · {profile[dominant.key]}% de afinidad
          </span>
        </motion.div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}
      >
        {KPI_ITEMS.map((kpi, i) => {
          const Icon  = kpi.Icon;
          const up    = kpi.trend >= 0;
          const TrendIcon = up ? TrendingUp : TrendingDown;
          return (
            <motion.div
              key={i}
              variants={STAGGER_ITEM}
              whileHover={{ scale: 1.025, boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 22px rgba(59,110,248,0.14)' }}
              style={{ ...CARD, padding: '20px 22px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: `${kpi.color}18`, border: `1px solid ${kpi.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={17} color={kpi.color} />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: '0.72rem', fontWeight: 600,
                  color: up ? 'var(--success)' : 'var(--danger)',
                }}>
                  <TrendIcon size={12} />
                  {up ? '+' : ''}{kpi.trend}
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontSize: '2rem', fontWeight: 800,
                color: 'var(--text-primary)', lineHeight: 1,
                marginBottom: 4,
              }}>
                <AnimatedCounter to={kpi.value} suffix={kpi.suffix} />
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {kpi.label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Main: Radar Card (full width) ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.18 }}
        whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(59,110,248,0.12)' }}
        style={{ ...CARD, padding: '30px 36px', marginBottom: 22 }}
      >
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 'var(--radius-sm)',
              background: 'rgba(59,110,248,0.12)', border: '1px solid rgba(59,110,248,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={18} color="var(--accent-blue)" />
            </div>
            <div>
              <h2 style={{
                margin: 0, fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)',
              }}>
                Tu perfil de aprendizaje actual
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Vector [V, A, R, K] calculado con tus últimas sesiones
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/historial')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
          >
            Ver historial completo
            <ChevronRight size={15} />
          </Button>
        </div>

        {/* Radar + dimension breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          {/* Radar chart — prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
            style={{ flex: '0 0 auto' }}
          >
            <RadarChart data={profile} size={340} />
          </motion.div>

          {/* VARK dimension breakdown */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
            {VARK_DIMS.map((dim, i) => (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.38, delay: 0.3 + i * 0.08 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: dim.color, flexShrink: 0,
                      boxShadow: `0 0 6px ${dim.color}80`,
                    }} />
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {dim.label}
                    </span>
                    {dim.key === dominant.key && (
                      <Badge variant={dim.badge} size="sm">Dominante</Badge>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-syne), Syne, sans-serif',
                    fontSize: '1.05rem', fontWeight: 800, color: dim.color,
                  }}>
                    {profile[dim.key]}%
                  </span>
                </div>
                <ProgressBar value={profile[dim.key]} color={dim.color} delay={0.35 + i * 0.08} />
              </motion.div>
            ))}

            {/* Tip contextual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'rgba(59,110,248,0.07)', border: '1px solid rgba(59,110,248,0.18)',
                fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55,
              }}
            >
              <Zap size={13} color="var(--accent-blue)" style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Como aprendiz <strong style={{ color: VARK_DIMS.find(d => d.key === dominant.key)?.color || 'var(--accent-blue)' }}>{dominant.label}</strong>, los contenidos estructurados y alineados a tu estilo refuerzan tu asimilación de conocimiento.
              ¡Sigue explorando tus recomendaciones personalizadas!
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Grid inferior ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* LEFT — Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          style={{ ...CARD, padding: '24px 26px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{
              margin: 0, fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
            }}>
              Actividad reciente
            </h3>
            <Clock size={15} color="var(--text-muted)" />
          </div>

          <AnimatePresence>
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              {actividades.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Sin actividad registrada últimamente
                </div>
              ) : (
                actividades.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <motion.div
                      key={item.id}
                      variants={STAGGER_ITEM}
                      whileHover={{ background: 'var(--bg-glass-hover)', x: 2 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        background: `${item.color}18`, border: `1px solid ${item.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={15} color={item.color} />
                      </div>
                      <span style={{
                        flex: 1, fontSize: '0.82rem', color: 'var(--text-primary)',
                        fontWeight: 500, lineHeight: 1.3,
                      }}>
                        {item.descripcion}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {item.tiempo}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* RIGHT — Recomendados para ti */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
          style={{ ...CARD, padding: '24px 26px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{
              margin: 0, fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
            }}>
              Recomendados para ti hoy
            </h3>
            <Button
              variant="ghost"
              onClick={() => router.push('/recomendaciones')}
              style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Ver todos <ArrowUpRight size={13} />
            </Button>
          </div>

          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {recomendados.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No hay recursos recomendados disponibles hoy
              </div>
            ) : (
              recomendados.map((rec, i) => {
                const Icon = TIPO_ICON[rec.tipo];
                const pct  = rec.compatibilidad;
                return (
                  <motion.div
                    key={rec.id}
                    variants={STAGGER_ITEM}
                    whileHover={{ scale: 1.015, boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 16px rgba(59,110,248,0.1)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleResourceClick(rec)}
                    style={{
                      padding: '14px 16px', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Icon */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        background: 'rgba(59,110,248,0.1)', border: '1px solid rgba(59,110,248,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} color="var(--accent-blue)" />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.82rem', fontWeight: 600,
                          color: 'var(--text-primary)', marginBottom: 5,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {rec.titulo}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <Badge variant={VARK_BADGE_VAR[rec.vark]} size="sm">{rec.vark}</Badge>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {TIPO_LABEL[rec.tipo]} · {rec.tema}
                          </span>
                        </div>

                        {/* Compatibility bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            flex: 1, height: 4, borderRadius: 99,
                            background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.65, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                              style={{
                                height: '100%', borderRadius: 99,
                                background: `linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))`,
                              }}
                            />
                          </div>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            color: pct >= 90 ? 'var(--success)' : pct >= 80 ? 'var(--warning)' : 'var(--text-secondary)',
                            flexShrink: 0,
                          }}>
                            {pct}% afinidad
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
