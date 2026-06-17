'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  CheckCircle2, Play, RefreshCw, Brain,
  TrendingUp, TrendingDown, Minus, Calendar,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Badge from '@/components/ui/Badge';

import { getHistorialVarkDetalle } from '@/services/analitica';
import { HistorialVarkDetalle } from '@/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type RangeKey = '7d' | '1m' | '3m';
type EventType = 'quiz' | 'recurso' | 'sistema' | 'test';

interface DataPoint { fecha: string; v: number; a: number; r: number; k: number }
interface TimelineEvent {
  id: string; type: EventType; descripcion: string; fecha: string; color: string;
}

// ─── VARK config ─────────────────────────────────────────────────────────────

const VARK_LINES = [
  { key: 'v' as const, label: 'Visual',      color: '#3b6ef8', cssVar: 'var(--vark-v)' },
  { key: 'a' as const, label: 'Auditivo',    color: '#a78bfa', cssVar: 'var(--vark-a)' },
  { key: 'r' as const, label: 'Lectura',     color: '#00d4ff', cssVar: 'var(--vark-r)' },
  { key: 'k' as const, label: 'Kinestésico', color: '#00e676', cssVar: 'var(--vark-k)' },
];

const EVENT_CFG: Record<EventType, { Icon: LucideIcon; color: string; label: string }> = {
  quiz:    { Icon: CheckCircle2, color: 'var(--success)',      label: 'Quiz completado'       },
  recurso: { Icon: Play,         color: 'var(--vark-v)',       label: 'Recurso visto'         },
  sistema: { Icon: RefreshCw,    color: 'var(--warning)',      label: 'Perfil recalculado'    },
  test:    { Icon: Brain,        color: 'var(--vark-a)',       label: 'Test VARK realizado'   },
};

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7d', label: 'Última semana'  },
  { key: '1m', label: 'Último mes'     },
  { key: '3m', label: 'Últimos 3 meses'},
];

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

const STAGGER = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item:      { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.32 } } },
};

// ─── Custom tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(5,11,31,0.97)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 18px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '0 0 8px' }}>{label}</p>
      {VARK_LINES.map((vl) => {
        const entry = payload.find((p: { dataKey: string }) => p.dataKey === vl.key);
        if (!entry) return null;
        return (
          <div key={vl.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: vl.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', flex: 1 }}>{vl.label}</span>
            <span style={{ color: vl.color, fontWeight: 700, fontSize: '0.9rem' }}>{entry.value}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Custom legend ────────────────────────────────────────────────────────────

function CustomLegend({
  hiddenLines, onToggle,
}: { hiddenLines: Set<string>; onToggle: (key: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
      {VARK_LINES.map((vl) => {
        const hidden = hiddenLines.has(vl.key);
        return (
          <motion.button
            key={vl.key}
            onClick={() => onToggle(vl.key)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: hidden ? 'transparent' : `${vl.color}15`,
              border: `1px solid ${hidden ? 'var(--border-glass)' : vl.color}60`,
              borderRadius: 99, padding: '5px 14px',
              cursor: 'pointer', opacity: hidden ? 0.4 : 1,
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 10, height: 3, borderRadius: 99,
              background: hidden ? 'var(--text-muted)' : vl.color,
            }} />
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
              color: hidden ? 'var(--text-muted)' : vl.color,
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
              textTransform: 'uppercase',
            }}>
              {vl.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Summary table ────────────────────────────────────────────────────────────

function SummaryTable({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No hay datos suficientes para calcular deltas de cambios.
      </div>
    );
  }

  const first = data[0];
  const last  = data[data.length - 1];

  const rows = VARK_LINES.map((vl) => {
    const ini = first[vl.key];
    const cur = last[vl.key];
    const delta = cur - ini;
    return { ...vl, ini, cur, delta };
  });

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 90px 110px',
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: 4,
      }}>
        {['Dimensión', 'Inicial', 'Actual', 'Cambio'].map((h) => (
          <span key={h} style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
          }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <motion.div
        variants={STAGGER.container}
        initial="hidden"
        animate="visible"
      >
        {rows.map((row, i) => (
          <motion.div
            key={row.key}
            variants={STAGGER.item}
            whileHover={{ background: 'var(--bg-glass-hover)' }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 90px 90px 110px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            {/* Dimension */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: row.color, flexShrink: 0,
                boxShadow: `0 0 6px ${row.color}80`,
              }} />
              <span style={{
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
                fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
              }}>
                {row.label}
              </span>
            </div>

            {/* Inicial */}
            <span style={{
              fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500,
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
            }}>
              {row.ini}%
            </span>

            {/* Actual */}
            <span style={{
              fontSize: '0.88rem', fontWeight: 700, color: row.color,
              fontFamily: 'var(--font-syne), Syne, sans-serif',
            }}>
              {row.cur}%
            </span>

            {/* Delta badge */}
            <div>
              {row.delta > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TrendingUp size={13} color="var(--success)" />
                  <Badge variant="success">+{row.delta}%</Badge>
                </div>
              ) : row.delta < 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TrendingDown size={13} color="var(--danger)" />
                  <Badge variant="danger">{row.delta}%</Badge>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Minus size={13} color="var(--text-muted)" />
                  <Badge variant="ghost">Sin cambio</Badge>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistorialPage() {
  const [range, setRange]           = useState<RangeKey>('1m');
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const [chartKey, setChartKey]     = useState(0); // forces chart remount on range change

  const [rawHistory, setRawHistory] = useState<HistorialVarkDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const historyData = await getHistorialVarkDetalle();
        setRawHistory(historyData);
      } catch (err) {
        console.error('Error al cargar historial VARK:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleRangeChange = (key: RangeKey) => {
    setRange(key);
    setChartKey((k) => k + 1); // triggers chart re-animation
  };

  const toggleLine = (key: string) => {
    setHiddenLines((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Filtrar y ordenar los puntos de forma cronológica ascendente
  const data = useMemo(() => {
    if (rawHistory.length === 0) return [];

    const now = new Date();
    let daysLimit = 30;
    if (range === '7d') daysLimit = 7;
    else if (range === '3m') daysLimit = 90;

    const limitDate = new Date();
    limitDate.setDate(now.getDate() - daysLimit);

    // Filtrar por rango temporal, luego ordenar cronológicamente ascendente (inverso de la respuesta de API)
    return rawHistory
      .filter((h) => new Date(h.fecha) >= limitDate)
      .slice()
      .reverse()
      .map((h) => {
        const dateObj = new Date(h.fecha);
        return {
          fecha: dateObj.toLocaleDateString('es', { day: 'numeric', month: 'short' }),
          v: Math.round(h.vector_nuevo.V * 100),
          a: Math.round(h.vector_nuevo.A * 100),
          r: Math.round(h.vector_nuevo.R * 100),
          k: Math.round(h.vector_nuevo.K * 100),
        };
      });
  }, [rawHistory, range]);

  // Tick interval for X axis — fewer ticks for larger ranges
  const tickInterval = range === '7d' ? 0 : range === '1m' ? 4 : 11;

  // Eventos clave de la línea de tiempo
  const timelineEvents = useMemo(() => {
    return rawHistory.slice(0, 8).map((h) => {
      let type: EventType = 'sistema';
      let color = 'var(--warning)';
      const oLower = h.origen.toLowerCase();

      if (oLower.includes('quiz')) {
        type = 'quiz';
        color = 'var(--success)';
      } else if (oLower.includes('clickstream') || oLower.includes('procesamiento')) {
        type = 'recurso';
        color = 'var(--vark-v)';
      } else if (oLower.includes('inicial') || oLower.includes('test')) {
        type = 'test';
        color = 'var(--vark-a)';
      }

      const dateObj = new Date(h.fecha);
      const formattedTime = dateObj.toLocaleDateString('es', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      return {
        id: String(h.id),
        type,
        descripcion: `Tu perfil se actualizó mediante ${h.origen}. Visual: ${Math.round(h.vector_nuevo.V * 100)}%, Auditivo: ${Math.round(h.vector_nuevo.A * 100)}%, Lectura: ${Math.round(h.vector_nuevo.R * 100)}%, Kinestésico: ${Math.round(h.vector_nuevo.K * 100)}%`,
        fecha: formattedTime,
        color,
      };
    });
  }, [rawHistory]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.2rem' }}>Cargando evolución temporal...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontSize: '1.75rem', fontWeight: 800,
            color: 'var(--text-primary)', margin: 0,
          }}>
            Evolución de tu{' '}
            <span style={{ color: 'var(--accent-blue)' }}>perfil VARK</span>
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            CU-18 · Historial de cambios en el vector [V, A, R, K]
          </p>
        </div>

        {/* Range selector pills */}
        <div style={{
          display: 'flex', gap: 6, padding: '5px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
        }}>
          {RANGE_OPTIONS.map((opt) => {
            const active = range === opt.key;
            return (
              <motion.button
                key={opt.key}
                onClick={() => handleRangeChange(opt.key)}
                whileHover={{ filter: 'brightness(1.12)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: active ? 'var(--accent-blue)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s',
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Calendar size={12} />
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Line chart ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`chart-${chartKey}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 32px rgba(59,110,248,0.1)' }}
          style={{ ...CARD, padding: '28px 28px 20px', marginBottom: 20 }}
        >
          {/* Chart header */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              margin: 0, fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)',
            }}>
              Gráfico de evolución temporal
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Click en la leyenda para mostrar u ocultar cada dimensión
            </p>
          </div>

          {/* Recharts LineChart */}
          {data.length === 0 ? (
            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No hay suficientes registros en este período para graficar la evolución.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="fecha"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }}
                  axisLine={{ stroke: 'var(--border-glass)' }}
                  tickLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend content={() => null} /> {/* hidden — using custom legend */}
                {VARK_LINES.map((vl) => (
                  <Line
                    key={vl.key}
                    type="monotone"
                    dataKey={vl.key}
                    stroke={vl.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: vl.color, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                    hide={hiddenLines.has(vl.key)}
                    strokeOpacity={hiddenLines.size > 0 && !hiddenLines.has(vl.key) ? 1 : hiddenLines.has(vl.key) ? 0 : 1}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Custom interactive legend */}
          <CustomLegend hiddenLines={hiddenLines} onToggle={toggleLine} />
        </motion.div>
      </AnimatePresence>

      {/* ── Summary table + Timeline ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* LEFT — Summary */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.15 }}
          style={{ ...CARD, padding: '24px 0 16px' }}
        >
          <h3 style={{
            margin: '0 16px 16px',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
          }}>
            Resumen de cambios
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={range}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <SummaryTable data={data} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* RIGHT — Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.22 }}
          style={{ ...CARD, padding: '24px 26px' }}
        >
          <h3 style={{
            margin: '0 0 20px',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
          }}>
            Eventos clave
          </h3>

          <div style={{ position: 'relative' }}>
            {/* Vertical connector line */}
            <div style={{
              position: 'absolute',
              left: 15, top: 16, bottom: 16,
              width: 1,
              background: 'linear-gradient(to bottom, var(--accent-blue)50, transparent)',
            }} />

            {timelineEvents.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Sin eventos de actualización en tu historial.
              </div>
            ) : (
              <motion.div
                variants={STAGGER.container}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {timelineEvents.map((ev) => {
                  const cfg  = EVENT_CFG[ev.type];
                  const Icon = cfg.Icon;
                  return (
                    <motion.div
                      key={ev.id}
                      variants={STAGGER.item}
                      style={{ display: 'flex', gap: 16, paddingBottom: 20 }}
                    >
                      {/* Dot + icon */}
                      <div style={{ position: 'relative', flexShrink: 0, width: 30 }}>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          style={{
                            width: 30, height: 30,
                            borderRadius: '50%',
                            background: `${ev.color}18`,
                            border: `1.5px solid ${ev.color}60`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', zIndex: 1,
                          }}
                        >
                          <Icon size={13} color={ev.color} />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <motion.div
                        whileHover={{ background: 'var(--bg-glass-hover)', x: 2 }}
                        style={{
                          flex: 1, padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-glass)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 700,
                              letterSpacing: '0.06em', textTransform: 'uppercase',
                              color: ev.color, display: 'block', marginBottom: 3,
                            }}>
                              {cfg.label}
                            </span>
                            <span style={{
                              fontSize: '0.82rem', fontWeight: 500,
                              color: 'var(--text-primary)', lineHeight: 1.4,
                            }}>
                              {ev.descripcion}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.68rem', color: 'var(--text-muted)',
                            whiteSpace: 'nowrap', flexShrink: 0,
                            marginTop: 2,
                          }}>
                            {ev.fecha}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
