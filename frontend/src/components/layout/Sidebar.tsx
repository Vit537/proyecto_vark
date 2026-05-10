'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Brain, BookOpen, HelpCircle,
  FileText, Sparkles, Clock, BarChart3,
  Settings, Activity, FlaskConical, LogOut,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: React.ElementType };

const mainNav: NavItem[] = [
  { href: '/dashboard',       label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/test-vark',       label: 'Test VARK',         icon: Brain },
  { href: '/temas',           label: 'Temas',             icon: BookOpen },
  { href: '/preguntas',       label: 'Preguntas',         icon: HelpCircle },
  { href: '/recursos',        label: 'Recursos',          icon: FileText },
  { href: '/recomendaciones', label: 'Recomendaciones',   icon: Sparkles },
  { href: '/historial',       label: 'Historial',         icon: Clock },
  { href: '/reportes',        label: 'Reportes',          icon: BarChart3 },
];

const adminNav: NavItem[] = [
  { href: '/admin/configuracion', label: 'Configuración',    icon: Settings },
  { href: '/admin/clickstream',   label: 'Clickstream',      icon: Activity },
  { href: '/admin/experimento',   label: 'Experimento A/B',  icon: FlaskConical },
];

function NavItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
      <motion.div
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: active ? 'rgba(59,110,248,0.12)' : 'transparent',
          border: `1px solid ${active ? 'rgba(59,110,248,0.25)' : 'transparent'}`,
          boxShadow: active ? '0 0 10px rgba(59,110,248,0.1)' : 'none',
          cursor: 'pointer',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <item.icon
          size={15}
          color={active ? 'var(--accent-blue)' : 'var(--text-muted)'}
          strokeWidth={active ? 2.2 : 1.8}
        />
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: active ? 600 : 400,
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
          }}
        >
          {item.label}
        </span>
        {active && (
          <motion.span
            layoutId="nav-active-dot"
            style={{
              marginLeft: 'auto',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              flexShrink: 0,
            }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(59,110,248,0.15)',
            border: '1px solid rgba(59,110,248,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L4 8.5V19.5L14 25L24 19.5V8.5L14 3Z" stroke="#3b6ef8" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 3V25M4 8.5L14 14L24 8.5" stroke="#00d4ff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
          </svg>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            VARK
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Aprendizaje adaptativo
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <p
          style={{
            margin: '0 0 6px 4px',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
          }}
        >
          General
        </p>
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <div style={{ borderTop: '1px solid var(--border-glass)', margin: '14px 4px 10px', paddingTop: 12 }}>
          <p
            style={{
              margin: '0 0 6px 4px',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
            }}
          >
            Admin
          </p>
          {adminNav.map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid var(--border-glass)', flexShrink: 0 }}>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <LogOut size={15} color="var(--text-muted)" strokeWidth={1.8} />
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
            }}
          >
            Cerrar sesión
          </span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
