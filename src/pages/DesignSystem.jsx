import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

// ─── Design Tokens (aligned to design-system repo) ──────────────────────────

const BRAND_REDS = [
  { token: 'red-900', hex: '#6B000E', role: 'Shadow',   dark: true },
  { token: 'red-800', hex: '#861D1E', role: 'Heritage', dark: true },
  { token: 'red-700', hex: '#9E0015', role: 'Brand ★',  dark: true },
  { token: 'red-500', hex: '#EF3537', role: 'Accent',   dark: true },
  { token: 'red-400', hex: '#E6332B', role: 'Signal',   dark: true },
  { token: 'red-200', hex: '#FCDADA', role: 'Soft',     dark: false },
]

const NEUTRALS = [
  { token: 'black',     hex: '#0A0A0A', role: 'FG',          dark: true  },
  { token: 'gray-900',  hex: '#191919', role: 'Surface inv.', dark: true  },
  { token: 'gray-700',  hex: '#333333', role: 'FG strong',    dark: true  },
  { token: 'gray-600',  hex: '#666666', role: 'FG muted',     dark: true  },
  { token: 'gray-300',  hex: '#CFC2C2', role: 'Border',       dark: false },
  { token: 'cream-100', hex: '#F5F2EE', role: 'Surface',      dark: false },
]

const GRADIENTS = [
  {
    token: 'grad-red-sunset',
    label: 'Signature',
    context: 'Hero · testimonials',
    css: 'linear-gradient(180deg, #DF0000 0%, #E41B2A 35%, #E52741 60%, #EA445A 85%, #FC593C 100%)',
  },
  {
    token: 'grad-red-warm',
    label: 'Portrait overlay',
    context: 'Photos',
    css: 'linear-gradient(180deg, #FF1F1F 0%, #EF3537 45%, #FF6B5A 100%)',
  },
  {
    token: 'grad-coral-glow',
    label: 'Spotlight',
    context: 'Big numbers',
    css: 'radial-gradient(120% 90% at 80% 110%, #FC593C 0%, #EA445A 25%, #E5213B 55%, #DF0000 90%)',
  },
  {
    token: 'grad-red-deep',
    label: 'Heritage',
    context: 'Section anchors',
    css: 'linear-gradient(180deg, #9E0015 0%, #6B000E 70%, #2A0008 100%)',
  },
]

const FONT_FAMILIES = [
  { name: 'Network',         role: 'Display',   css: 'Network, cursive',            desc: 'Editorial. 56–258px. Títulos de seção e grandes saudações.' },
  { name: 'ABCWhyteInktrap', role: 'Heading',   css: 'ABCWhyteInktrap, sans-serif', desc: 'Subheads, cards e UI. 20–64px. Bold para impacto, Medium para subhead.' },
  { name: 'ABCWhyte',        role: 'Sans',      css: 'ABCWhyte, sans-serif',        desc: 'Nomes, cargos e rótulos. Light / Regular / Medium.' },
  { name: 'ABCWhyteMono',    role: 'Mono',      css: 'ABCWhyteMono, monospace',     desc: 'Datas, tags, kickers. SEMPRE UPPERCASE com +0.05em tracking.' },
  { name: 'Inter',           role: 'Body',      css: 'Inter, sans-serif',           desc: 'Texto corrido e descrições. 14–18px. Pesos 400–600.' },
]

const TYPE_SCALE = [
  { name: 'display-xl', size: '120px', lh: '0.85', family: 'Network, cursive',            specimen: 'Olá!',           red: true  },
  { name: 'display-lg', size: '72px',  lh: '0.86', family: 'Network, cursive',            specimen: 'Projetos'               },
  { name: 'display-md', size: '56px',  lh: '0.88', family: 'Network, cursive',            specimen: 'Sobre mim',      red: true  },
  { name: 'heading-h1', size: '40px',  lh: '1.05', family: 'ABCWhyteInktrap, sans-serif', specimen: 'UX/UI Design Leader'    },
  { name: 'heading-h2', size: '28px',  lh: '1.07', family: 'ABCWhyteInktrap, sans-serif', specimen: 'Experiência Técnica',    red: true  },
  { name: 'body-lg',    size: '18px',  lh: '1.4',  family: 'Inter, sans-serif',           specimen: 'Sou um líder de Design com mais de 15 anos construindo produtos digitais de alto impacto.' },
  { name: 'body-md',    size: '15px',  lh: '1.5',  family: 'Inter, sans-serif',           specimen: 'Já atuei em grandes empresas como Wine, Itaú e Mercado Livre, sempre com o pé no negócio e o olho nas pessoas.' },
  { name: 'mono-uc',    size: '11px',  lh: '1.0',  family: 'ABCWhyteMono, monospace',     specimen: 'UX SR MANAGER · MERCADO PAGO', upper: true },
]

const SPACING = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128]

const RADII = [
  { name: '4',    value: '4px',     sig: false },
  { name: '8',    value: '8px',     sig: false },
  { name: '16',   value: '16px',    sig: false },
  { name: '24',   value: '24px',    sig: false },
  { name: '40 ★', value: '40px',    sig: true  },
  { name: 'pill', value: '9999px',  sig: false },
]

const SHADOWS = [
  { name: 'xs',  light: '0 1px 4px rgba(0,0,0,0.06)',   dark: '0 1px 4px rgba(0,0,0,0.3)'  },
  { name: 'sm',  light: '0 2px 8px rgba(0,0,0,0.08)',   dark: '0 2px 8px rgba(0,0,0,0.4)'  },
  { name: 'md',  light: '0 4px 16px rgba(0,0,0,0.1)',   dark: '0 4px 16px rgba(0,0,0,0.5)' },
  { name: 'lg',  light: '0 8px 32px rgba(0,0,0,0.12)',  dark: '0 8px 32px rgba(0,0,0,0.6)' },
  { name: 'xl',  light: '0 16px 48px rgba(0,0,0,0.15)', dark: '0 16px 48px rgba(0,0,0,0.7)'},
  { name: 'red', light: '0 8px 32px rgba(158,0,21,0.25)',dark: '0 8px 32px rgba(239,53,55,0.35)'},
]

const EASINGS = [
  { name: 'smooth',   fm: [0.4,0,0.2,1],      css: 'cubic-bezier(0.4,0,0.2,1)',     desc: 'State changes' },
  { name: 'expo-out', fm: [0.16,1,0.3,1],     css: 'cubic-bezier(0.16,1,0.3,1)',   desc: 'Entrances' },
  { name: 'bounce',   fm: [0.34,1.56,0.64,1], css: 'cubic-bezier(0.34,1.56,0.64,1)',desc: 'Playful' },
  { name: 'ease-in',  fm: [0.4,0,1,1],        css: 'cubic-bezier(0.4,0,1,1)',      desc: 'Exits' },
  { name: 'ease-out', fm: [0,0,0.2,1],        css: 'cubic-bezier(0,0,0.2,1)',      desc: 'Deceleration' },
]

const VOICE_CARDS = [
  {
    label: 'Display headline',
    main: 'Olá!',
    sub: '"UX/UI Design Leader · Strategy & Tech"',
    note: 'Sentence case · pontuação como textura',
    isDisplay: true,
  },
  {
    label: 'Body voice',
    main: '"Sou um líder de Design com mais de 15 anos construindo produtos digitais de alto impacto."',
    sub: '"Liderei times multidisciplinares em projetos de alta complexidade para toda a América Latina."',
    note: 'Primeira pessoa · verbos no passado · dados como prova',
  },
  {
    label: 'Labels & tags',
    main: 'FINANCE · LEADERSHIP · UX/UI',
    sub: '2021 — 2026 · 5 anos',
    note: 'UPPERCASE · 0.05em tracking · separator ·',
    isMono: true,
  },
]

const NAV_GROUPS = [
  { label: '01 · Foundations', items: [
    { id: 'brand',     label: 'Brand' },
    { id: 'color',     label: 'Color' },
    { id: 'gradients', label: 'Gradients' },
    { id: 'type',      label: 'Type' },
    { id: 'space',     label: 'Space & Radii' },
    { id: 'shadows',   label: 'Shadows' },
  ]},
  { label: '02 · Voice', items: [
    { id: 'voice', label: 'Tone & Copy' },
  ]},
  { label: '03 · Components', items: [
    { id: 'buttons',  label: 'Buttons' },
    { id: 'tags',     label: 'Tags & Icons' },
    { id: 'cards',    label: 'Cards' },
    { id: 'motion',   label: 'Motion' },
  ]},
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ num, title, titleRed, desc, isDark }) {
  const fg = isDark ? '#F5F2EE' : '#0A0A0A'
  const muted = isDark ? 'rgba(245,242,238,0.55)' : 'rgba(10,10,10,0.55)'
  return (
    <header style={{ display: 'grid', gridTemplateColumns: 'clamp(80px,16%,180px) 1fr', gap: 'clamp(16px,4%,48px)', marginBottom: 56, alignItems: 'end' }}>
      <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#EF3537', paddingBottom: 8 }}>{num}</span>
      <div>
        <h2 style={{ margin: '0 0 16px', fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.0, color: fg, letterSpacing: '-0.01em' }}>
          {titleRed ? (
            <>{title} <em style={{ fontStyle: 'normal', color: '#EF3537' }}>{titleRed}</em></>
          ) : title}
        </h2>
        {desc && <p style={{ margin: 0, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 400, fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.45, color: muted, maxWidth: '56ch' }}>{desc}</p>}
      </div>
    </header>
  )
}

function ColorSwatch({ token, hex, role, dark: textDark }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1100)
  }
  const textColor = textDark ? '#F5F2EE' : '#0A0A0A'
  return (
    <div onClick={copy} title={`Copy ${hex}`} style={{ cursor: 'pointer', aspectRatio: '1/1.25', borderRadius: 14, padding: '14px 16px', background: hex, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', transition: 'transform 0.15s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: textColor, opacity: 0.85 }}>{token}</span>
      <div>
        <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 13, fontWeight: 500, color: textColor }}>{hex}</div>
        <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: textColor, opacity: 0.7, marginTop: 3 }}>{role}</div>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600 }}>Copiado</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GradientCard({ token, label, context, css, isDark }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1100)
  }
  return (
    <div onClick={copy} style={{ cursor: 'pointer', aspectRatio: '1/1.25', borderRadius: 16, background: css, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#F5F2EE', position: 'relative', overflow: 'hidden' }}>
      <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.85 }}>{token}</span>
      <div>
        <div style={{ fontFamily: 'ABCWhyte, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: 1.1 }}>{label}</div>
        <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginTop: 4 }}>{context}</div>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600 }}>CSS copiado</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EasingDemo({ name, fm, css, desc, isDark, cardBg, border, text }) {
  const [key, setKey] = useState(0)
  const [playing, setPlaying] = useState(false)
  function play() { setKey(k => k + 1); setTimeout(() => setPlaying(true), 16); setTimeout(() => setPlaying(false), 1400) }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'clamp(90px,18%,150px) 1fr clamp(120px,28%,220px)', alignItems: 'center', gap: 16, padding: '13px 18px', borderRadius: 10, background: cardBg, border: `1px solid ${border}`, marginBottom: 2 }}>
      <div>
        <div style={{ fontSize: 12, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>{name}</div>
        <div style={{ fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: isDark ? 'rgba(245,242,238,0.4)' : 'rgba(10,10,10,0.4)', marginTop: 2 }}>{desc}</div>
      </div>
      <div key={key} onClick={play} title="Click to preview" style={{ height: 28, borderRadius: 4, background: isDark ? '#1A1A1A' : '#ECEAE6', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
        <motion.div animate={playing ? { x: ['4px','calc(100% - 28px)'] } : { x: '4px' }} transition={{ duration: 0.8, ease: fm }}
          style={{ position: 'absolute', top: 4, width: 20, height: 20, borderRadius: 4, background: '#EF3537' }} />
      </div>
      <div style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.3)' : 'rgba(10,10,10,0.3)', wordBreak: 'break-all', lineHeight: 1.5 }}>{css}</div>
    </div>
  )
}

// ─── Password Gate ───────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const { isDark } = useTheme()
  const bg = isDark ? '#0A0A0A' : '#F5F2EE'
  const text = isDark ? '#F5F2EE' : '#0A0A0A'
  const cardBg = isDark ? '#141414' : '#FFFFFF'
  const border = isDark ? 'rgba(245,242,238,0.12)' : 'rgba(10,10,10,0.14)'

  function handleSubmit(e) {
    e.preventDefault()
    if (value === '030790') { onUnlock(); return }
    setError(true); setValue(''); setTimeout(() => setError(false), 700)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24, transition: 'background 0.4s' }}>
      <motion.form onSubmit={handleSubmit}
        animate={error ? { x: [-10,10,-8,8,-4,4,0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 300 }}
      >
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: cardBg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.07)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="11" width="16" height="11" rx="3" fill={text} opacity="0.85"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke={text} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85"/>
            <circle cx="12" cy="16.5" r="1.5" fill={bg}/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? 'rgba(245,242,238,0.32)' : 'rgba(10,10,10,0.32)' }}>David Hulle</p>
          <h1 style={{ margin: 0, fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 22, fontWeight: 700, color: text, lineHeight: 1.2 }}>Design System</h1>
        </div>
        <input type="password" placeholder="Senha de acesso" value={value} onChange={e => setValue(e.target.value)} autoFocus
          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', fontSize: 14, fontFamily: 'ABCWhyteMono, monospace', letterSpacing: '0.1em', textAlign: 'center', background: cardBg, color: text, border: `1.5px solid ${error ? '#EF3537' : border}`, borderRadius: 10, outline: 'none', transition: 'border-color 0.2s' }}
        />
        <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ width: '100%', padding: '13px 16px', fontSize: 12, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#EF3537', color: '#FFFFFF', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
          Entrar
        </motion.button>
        <AnimatePresence>
          {error && <motion.p key="e" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ margin: 0, color: '#EF3537', fontFamily: 'ABCWhyte, sans-serif', fontSize: 12 }}>Senha incorreta</motion.p>}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarInner({ isDark, activeId, onClose }) {
  const bg     = isDark ? '#0F0F0F' : '#F0EDE9'
  const border = isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'
  const text   = isDark ? '#F5F2EE' : '#0A0A0A'
  const muted  = isDark ? 'rgba(245,242,238,0.32)' : 'rgba(10,10,10,0.32)'

  function handleClick(id) {
    if (onClose) onClose()
    setTimeout(() => scrollTo(id), onClose ? 200 : 0)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', gap: 24, padding: '28px 20px', overflowY: 'auto' }}>

      {/* Brand row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#hero" onClick={e => { e.preventDefault(); handleClick('hero') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logos/logo-simbolo.svg" alt="DH" width={22} height={26}
            style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'ABCWhyte, sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em', lineHeight: 1.1, color: text }}>DH Design System</div>
            <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 2, color: text }}>v2 · May 2026</div>
          </div>
        </a>
        {onClose && (
          <button onClick={onClose} aria-label="Fechar menu"
            style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: text }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {NAV_GROUPS.map(g => (
          <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#EF3537', padding: '0 10px 6px' }}>{g.label}</span>
            {g.items.map(item => {
              const isActive = activeId === item.id
              return (
                <a key={item.id} href={`#${item.id}`}
                  onClick={e => { e.preventDefault(); handleClick(item.id) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    padding: '7px 0', paddingLeft: 10, paddingRight: 8,
                    borderRadius: 7,
                    fontFamily: 'ABCWhyteMono, monospace', fontSize: 12,
                    color: isActive ? '#EF3537' : text,
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? (isDark ? 'rgba(239,53,55,0.08)' : 'rgba(239,53,55,0.06)') : 'transparent',
                    borderLeft: `2px solid ${isActive ? '#EF3537' : 'transparent'}`,
                    transition: 'all 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#EF3537'; e.currentTarget.style.background = isDark ? 'rgba(245,242,238,0.04)' : 'rgba(10,10,10,0.03)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = text; e.currentTarget.style.background = 'transparent' } }}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Meta */}
      <div style={{ marginTop: 'auto', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, lineHeight: 1.7, color: muted }}>
        <span style={{ color: text, fontWeight: 500, fontFamily: 'ABCWhyte, sans-serif' }}>David Hulle</span><br />
        Product Design Leader<br />
        <span style={{ opacity: 0.6 }}>davidhulle.com</span>
      </div>
    </div>
  )
}

function Sidebar({ isDark, activeId }) {
  const border = isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'
  return (
    <aside style={{ position: 'sticky', top: 0, height: '100vh', borderRight: `1px solid ${border}` }}>
      <SidebarInner isDark={isDark} activeId={activeId} />
    </aside>
  )
}

// ─── Design System Content ───────────────────────────────────────────────────

const ALL_SECTION_IDS = ['hero', 'brand', 'color', 'gradients', 'type', 'space', 'shadows', 'voice', 'buttons', 'tags', 'cards', 'motion']

function DesignSystemContent() {
  const { isDark } = useTheme()
  const [isMobile, setIsMobile]     = useState(false)
  const [activeId, setActiveId]     = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toggleOn, setToggleOn]     = useState(false)
  const [radioVal, setRadioVal]     = useState('a')
  const [inputVal, setInputVal]     = useState('')

  // Breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) })
      },
      { rootMargin: '-15% 0px -75% 0px' }
    )
    ALL_SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const bg     = isDark ? '#0A0A0A' : '#F5F2EE'
  const text   = isDark ? '#F5F2EE' : '#0A0A0A'
  const cardBg = isDark ? '#141414' : '#FFFFFF'
  const secBg  = isDark ? '#0F0F0F' : '#F0EDE9'
  const border = isDark ? 'rgba(245,242,238,0.09)' : 'rgba(10,10,10,0.09)'
  const muted  = isDark ? 'rgba(245,242,238,0.5)'  : 'rgba(10,10,10,0.5)'
  const pad    = 'clamp(32px,6vw,80px)'

  const sidebarBg  = isDark ? '#0F0F0F' : '#F0EDE9'
  const sidebarBdr = isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, transition: 'background-color 0.4s ease, color 0.4s ease' }}>

      {/* ── Mobile header bar ── */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          height: 52,
          background: isDark ? 'rgba(15,15,15,0.92)' : 'rgba(240,237,233,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${sidebarBdr}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logos/logo-simbolo.svg" alt="DH" width={18} height={22}
              style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
            <span style={{ fontFamily: 'ABCWhyte, sans-serif', fontWeight: 800, fontSize: 13, color: text }}>Design System</span>
            <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,53,55,0.12)', color: '#EF3537', textTransform: 'uppercase', letterSpacing: '0.08em' }}>v2</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu de navegação"
            style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${sidebarBdr}`, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: text }}
          >
            <span style={{ width: 16, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block', transition: 'transform 0.2s' }} />
            <span style={{ width: 16, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block' }} />
            <span style={{ width: 10, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block', alignSelf: 'flex-start', marginLeft: 3 }} />
          </button>
        </div>
      )}

      {/* ── Mobile drawer + overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 400,
                width: 'min(280px, 85vw)',
                background: sidebarBg,
                borderRight: `1px solid ${sidebarBdr}`,
                boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
              }}
            >
              <SidebarInner isDark={isDark} activeId={activeId} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Grid: sidebar + main ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', minHeight: '100vh' }}>

        {!isMobile && <Sidebar isDark={isDark} activeId={activeId} />}

        {/* Offset main content on mobile to clear fixed header */}
        <div style={{ paddingTop: isMobile ? 52 : 0 }}>

        <main id="hero">

          {/* ── HERO ── */}
          <section style={{ position: 'relative', minHeight: '70vh', padding: `80px ${pad} 64px`, background: secBg, borderBottom: `1px solid ${border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            {/* Kicker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'ABCWhyteMono, monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EF3537' }}>
              <span style={{ width: 36, height: 1, background: '#EF3537', display: 'inline-block', flexShrink: 0 }} />
              DH Design System · v2 · aligned to production
            </div>
            {/* Display */}
            <div style={{ margin: '28px 0 0' }}>
              <h1 style={{ margin: 0, fontFamily: 'Network, cursive', fontSize: 'clamp(64px,11vw,180px)', lineHeight: 0.86, color: text, letterSpacing: '-0.02em' }}>
                A bold <em style={{ fontStyle: 'normal', color: '#EF3537' }}>signature</em>,<br />built to scale.
              </h1>
              <p style={{ margin: '28px 0 0', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 400, fontSize: 'clamp(16px,1.8vw,22px)', lineHeight: 1.3, maxWidth: '52ch', color: text }}>
                A linguagem visual e de conteúdo por trás de{' '}
                <a href="https://davidhulle.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: '#EF3537', textUnderlineOffset: 4 }}>davidhulle.com</a>
                {' '}— fundamentos, componentes e regras para criar interfaces e materiais sempre on-brand, em qualquer canal.
              </p>
            </div>
            {/* Metabar */}
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 24, marginTop: 80, paddingTop: 28, borderTop: `1px solid ${border}`, fontFamily: 'ABCWhyteMono, monospace', fontSize: 11 }}>
              {[['Brand','David Hulle'],['Lang','PT-BR · EN · ES'],['Surfaces','Web · Print · Slides'],['Source','davidhulle/portfolio']].map(([k,v]) => (
                <div key={k}><dt style={{ color: muted, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 9, marginBottom: 6 }}>{k}</dt><dd style={{ margin: 0, color: text, fontWeight: 500 }}>{v}</dd></div>
              ))}
            </dl>
          </section>

          {/* ── BRAND ── */}
          <section data-section id="brand" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.1 · Brand" title="Marca," titleRed="aplicada." desc="A marca é monograma + sobrenome. Quatro lockups cobrem todos os casos — sempre em preto, cream ou vermelho. Nunca recolorida fora dessa paleta." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {[
                { file: 'logo-horizontal', bg: secBg,    filter: 'none',                           label: 'Horizontal · Light' },
                { file: 'logo-vertical',   bg: '#0A0A0A', filter: 'brightness(0) invert(1)',        label: 'Vertical · Dark'   },
                { file: 'logo-simbolo',    bg: '#9E0015', filter: 'brightness(0) invert(1)',        label: 'Símbolo · Red'     },
                { file: 'logo-sobrenome',  bg: '#0A0A0A', filter: 'brightness(0) invert(1)',        label: 'Sobrenome · Dark'  },
              ].map(l => (
                <div key={l.file}>
                  <div style={{ aspectRatio: '1.6/1', borderRadius: 14, background: l.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, marginBottom: 8 }}>
                    <img src={`/logos/${l.file}.svg`} alt={l.label} style={{ maxWidth: '80%', maxHeight: 56, display: 'block', filter: l.filter }} />
                  </div>
                  <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted, textAlign: 'center' }}>{l.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── COLOR ── */}
          <section data-section id="color" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.2 · Color" title="Vermelho" titleRed="+ cream." desc="A paleta vive entre o vermelho-assinatura e o cream quente. Os neutros suportam, o vermelho dirige. Use a escala de 6 reds para criar profundidade sem diluir a marca." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 14 }}>
              {BRAND_REDS.map(c => <ColorSwatch key={c.token} {...c} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
              {NEUTRALS.map(c => <ColorSwatch key={c.token} {...c} />)}
            </div>
          </section>

          {/* ── GRADIENTS ── */}
          <section data-section id="gradients" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.3 · Gradients" title="Calor" titleRed="em camadas." desc="Quatro gradientes calibrados a partir da referência degrade.png. Use o sunset para grandes superfícies (testimonials, hero), o coral-glow como spotlight pontual e o deep para texturas heritage." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {GRADIENTS.map(g => <GradientCard key={g.token} {...g} isDark={isDark} />)}
            </div>
          </section>

          {/* ── TYPOGRAPHY ── */}
          <section data-section id="type" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.4 · Typography" title="Editorial" titleRed="& preciso." desc="Quatro famílias, cada uma com um trabalho. Network conduz a hierarquia editorial, ABC Whyte sustenta a UI, Inter cuida do texto longo." isDark={isDark} />

            {/* Font families */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 56 }}>
              {FONT_FAMILIES.map(f => (
                <div key={f.name} style={{ background: secBg, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 160 }}>
                  <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>{f.role} · {f.name}</span>
                  <span style={{ fontFamily: f.css, fontSize: f.role === 'Display' ? 56 : f.role === 'Heading' ? 32 : f.role === 'Mono' ? 18 : 28, lineHeight: 1, color: f.role === 'Display' ? '#EF3537' : text }}>
                    {f.role === 'Display' ? 'Olá!' : f.role === 'Heading' ? 'Liderança' : f.role === 'Mono' ? '2021 — 2026' : f.name === 'ABCWhyte' ? 'David Hulle' : 'Body text'}
                  </span>
                  <span style={{ marginTop: 'auto', fontFamily: 'Inter, sans-serif', fontSize: 12, color: muted, lineHeight: 1.4 }}>{f.desc}</span>
                </div>
              ))}
            </div>

            {/* Type scale */}
            <div style={{ display: 'grid', gridTemplateColumns: 'clamp(90px,16%,150px) 1fr', rowGap: 16, columnGap: 36, alignItems: 'baseline' }}>
              {TYPE_SCALE.map(t => (
                <>
                  <span key={`ti-${t.name}`} style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted, paddingTop: 12, lineHeight: 1.5 }}>
                    {t.name}<br />{t.size} / {t.lh}
                  </span>
                  <span key={`sp-${t.name}`} style={{ fontFamily: t.family, fontSize: t.size, lineHeight: t.lh, color: t.red ? '#EF3537' : text, textTransform: t.upper ? 'uppercase' : 'none', letterSpacing: t.upper ? '0.05em' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: t.size > '30px' ? 'nowrap' : 'normal' }}>
                    {t.specimen}
                  </span>
                </>
              ))}
            </div>
          </section>

          {/* ── SPACE & RADII ── */}
          <section data-section id="space" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.5 · Space & Radii" title="Ritmo de" titleRed="4 pontos." desc="Tudo se encaixa em múltiplos de 4. O raio de 40px é a assinatura: cards de mídia, hero e testimonials. Os outros raios apenas dão suporte." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 56 }}>
              {/* Spacing */}
              <div>
                <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, paddingBottom: 16, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>Spacing scale · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  {SPACING.map(s => (
                    <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 14, height: Math.min(s, 96), background: '#EF3537', borderRadius: 3 }} />
                      <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 8, color: muted, writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Radii */}
              <div>
                <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, paddingBottom: 16, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>Corner radii · Signature: 40px ★</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {RADII.map(r => (
                    <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: r.sig ? 80 : 56, height: r.sig ? 80 : 56, background: r.sig ? '#9E0015' : '#EF3537', borderRadius: r.value, opacity: r.sig ? 1 : 0.75 }} />
                      <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: r.sig ? '#EF3537' : muted, fontWeight: r.sig ? 600 : 400 }}>{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SHADOWS ── */}
          <section data-section id="shadows" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="01.6 · Shadows" title="Profundidade" titleRed="& elevação." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
              {SHADOWS.map(s => (
                <div key={s.name}>
                  <div style={{ height: 72, borderRadius: 12, background: cardBg, boxShadow: isDark ? s.dark : s.light, marginBottom: 12 }} />
                  <div style={{ fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text, marginBottom: 3 }}>shadow-{s.name}</div>
                  <div style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted, wordBreak: 'break-word', lineHeight: 1.5 }}>{isDark ? s.dark : s.light}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── VOICE ── */}
          <section data-section id="voice" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="02 · Tone & Copy" title="Voz direta," titleRed="com peso." desc="Primeira pessoa, verbos no passado, dados como prova. Português conduz, inglês ancora termos de craft. Zero emoji. Pontuação como textura: · e — separam, !? dá ritmo." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {VOICE_CARDS.map(v => (
                <div key={v.label} style={{ background: secBg, borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 180 }}>
                  <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF3537' }}>{v.label}</span>
                  {v.isDisplay ? (
                    <span style={{ fontFamily: 'Network, cursive', fontSize: 56, lineHeight: 0.86, color: '#EF3537' }}>{v.main}</span>
                  ) : (
                    <span style={{ fontFamily: v.isMono ? 'ABCWhyteMono, monospace' : 'Inter, sans-serif', fontSize: v.isMono ? 14 : 15, lineHeight: 1.4, color: text, textTransform: v.isMono ? 'uppercase' : 'none', letterSpacing: v.isMono ? '0.06em' : 'inherit' }}>{v.main}</span>
                  )}
                  {v.sub && <span style={{ fontFamily: v.isMono ? 'ABCWhyteMono, monospace' : v.isDisplay ? 'ABCWhyte, sans-serif' : 'Inter, sans-serif', fontSize: v.isDisplay ? 18 : v.isMono ? 14 : 14, color: muted, lineHeight: 1.4, textTransform: v.isMono ? 'uppercase' : 'none', letterSpacing: v.isMono ? '0.06em' : 'inherit' }}>{v.sub}</span>}
                  <span style={{ marginTop: 'auto', fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v.note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── BUTTONS ── */}
          <section data-section id="buttons" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="03.1 · Buttons" title="Quatro variantes," titleRed="dois tamanhos." desc="Dark, Light, Red e Subtle. Cada uma com Default, Hover e Active. Tudo em UPPERCASE ABCWhyte com tracking 0.05em." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>

              {/* Dark */}
              <div style={{ background: secBg, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>
                  <span>Dark · Small</span><span>28h · 8px</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button style={{ background: '#0A0A0A', color: '#F5F2EE', border: 0, borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>Button <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg></button>
                  <button style={{ background: '#333', color: '#F5F2EE', border: 0, borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Hover</button>
                  <button style={{ background: '#9E0015', color: '#F5F2EE', border: 0, borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active</button>
                  <button disabled style={{ background: '#333', color: 'rgba(245,242,238,0.25)', border: 0, borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'not-allowed' }}>Disabled</button>
                </div>
              </div>

              {/* Light (on dark surface) */}
              <div style={{ background: '#191919', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(245,242,238,0.4)' }}>
                  <span>Light · Small</span><span>on dark surface</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button style={{ background: 'transparent', color: '#F5F2EE', border: '1px solid rgba(245,242,238,0.25)', borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Button</button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', color: '#F5F2EE', border: '1px solid rgba(245,242,238,0.25)', borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Hover</button>
                  <button style={{ background: 'rgba(255,255,255,0.16)', color: '#F5F2EE', border: '1px solid rgba(245,242,238,0.3)', borderRadius: 8, padding: '8px 12px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active</button>
                </div>
              </div>

              {/* Red (primary CTA) */}
              <div style={{ background: secBg, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>
                  <span>Red · Medium</span><span>primary CTA</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button style={{ background: '#9E0015', color: '#F5F2EE', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>Contato <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg></button>
                  <button style={{ background: '#861D1E', color: '#F5F2EE', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Hover</button>
                  <button style={{ background: '#6B000E', color: '#FCDADA', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active</button>
                </div>
              </div>

              {/* Subtle (on red surface) */}
              <div style={{ background: '#9E0015', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(252,218,218,0.6)' }}>
                  <span>Subtle · Medium</span><span>on red surface</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button style={{ background: '#FCDADA', color: '#9E0015', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>Ler completo <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg></button>
                  <button style={{ background: '#FBC6C6', color: '#9E0015', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Hover</button>
                  <button style={{ background: '#EF3537', color: '#F5F2EE', border: 0, borderRadius: 10, padding: '12px 18px', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active</button>
                </div>
              </div>

            </div>
          </section>

          {/* ── TAGS & ICONS ── */}
          <section data-section id="tags" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="03.2 · Tags & Icons" title="Glyphs" titleRed="& chips." desc="Botões-ícone em pill, sempre. Tags com canto 8px. Quatro superfícies cobrem todas as combinações de fundo claro/escuro." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>

              {/* Icon buttons */}
              <div style={{ background: secBg, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>
                  <span>Icon Buttons</span><span>24 · 32 · 36 · 48px</span>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { bg: '#fff',     color: '#0A0A0A', brd: `1px solid ${border}`,         sz: 36, icon: '←' },
                    { bg: '#fff',     color: '#0A0A0A', brd: `1px solid ${border}`,         sz: 36, icon: '→' },
                    { bg: '#191919', color: '#F5F2EE', brd: 'none',                          sz: 36, icon: '☀' },
                    { bg: '#9E0015', color: '#F5F2EE', brd: 'none',                          sz: 36, icon: '↗' },
                    { bg: '#FCDADA', color: '#9E0015', brd: 'none',                          sz: 36, icon: '★' },
                    { bg: '#191919', color: '#F5F2EE', brd: 'none',                          sz: 48, icon: '↗' },
                  ].map((b, i) => (
                    <button key={i} style={{ width: b.sz, height: b.sz, borderRadius: '50%', background: b.bg, color: b.color, border: b.brd, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: b.sz * 0.38, cursor: 'pointer', flexShrink: 0 }}>{b.icon}</button>
                  ))}
                </div>
              </div>

              {/* Tag pills */}
              <div style={{ background: secBg, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>
                  <span>Tag Pills</span><span>8px radius · UPPER + 0.07em</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: '#FCDADA', color: '#6B000E' }}>Finance</span>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: '#FCDADA', color: '#6B000E' }}>Leadership</span>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: '#191919', color: '#F5F2EE' }}>UX/UI</span>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: '#191919', color: '#F5F2EE' }}>Ecommerce</span>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: '#EF3537', color: '#F5F2EE' }}>Destaque</span>
                  <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 8, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', background: 'transparent', color: text, border: `1px solid ${isDark ? 'rgba(245,242,238,0.25)' : 'rgba(10,10,10,0.25)'}` }}>Design System</span>
                </div>
              </div>

            </div>
          </section>

          {/* ── CARDS ── */}
          <section data-section id="cards" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="03.3 · Cards" title="Superfícies" titleRed="& containers." isDark={isDark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>

              {/* Default */}
              <div style={{ padding: 24, borderRadius: 16, background: cardBg, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.06)' }}>
                <span style={{ display: 'block', marginBottom: 8, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#EF3537' }}>Default</span>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 18, fontWeight: 700, color: text }}>Card title</h3>
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.6, color: muted }}>Descrição que contextualiza o conteúdo do card de forma sucinta.</p>
              </div>

              {/* Project card */}
              <div style={{ position: 'relative', aspectRatio: '1.5/1', borderRadius: 40, overflow: 'hidden', background: 'linear-gradient(180deg, #DF0000 0%, #E41B2A 35%, #E52741 60%, #EA445A 85%, #FC593C 100%)' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, fontSize: 13, color: '#F5F2EE', lineHeight: 1.15 }}>Mercado Pago</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {['Fintech','UX Lead'].map(t => <span key={t} style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 8, letterSpacing: '0.1em', padding: '3px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.15)', color: '#F5F2EE', textTransform: 'uppercase' }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F2EE', fontSize: 14 }}>↗</div>
                </div>
              </div>

              {/* Testimonial */}
              <div style={{ padding: 22, borderRadius: 18, background: 'rgba(10,10,10,0.85)', color: '#F5F2EE', minHeight: 160 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.4, margin: '0 0 16px' }}>
                  "David tem uma capacidade única de alinhar design e negócio com uma clareza impressionante."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FCDADA, #EF3537)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, fontSize: 13, lineHeight: 1.1 }}>Maria Silva</div>
                    <div style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 9, letterSpacing: '0.05em', opacity: 0.75, marginTop: 2, textTransform: 'uppercase' }}>Product Director · Mercado Pago</div>
                  </div>
                </div>
              </div>

              {/* Metric */}
              <div style={{ padding: 24, borderRadius: 16, background: cardBg, border: `1px solid ${border}` }}>
                <p style={{ margin: '0 0 2px', fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Metric card</p>
                <p style={{ margin: '0 0 4px', fontSize: 56, fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, color: '#EF3537', lineHeight: 1 }}>79%</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: 'Inter, sans-serif', color: muted }}>Aumento de conversão</p>
              </div>

            </div>
          </section>

          {/* ── MOTION ── */}
          <section data-section id="motion" style={{ padding: `80px ${pad}`, borderBottom: `1px solid ${border}` }}>
            <SectionHeader num="03.4 · Motion" title="Easing" titleRed="& timing." desc="Clique nas barras para visualizar a curva em ação. expo-out é o padrão para todas as entradas." isDark={isDark} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {EASINGS.map(e => <EasingDemo key={e.name} {...e} isDark={isDark} cardBg={secBg} border={border} text={text} />)}
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer style={{ background: '#0A0A0A', color: '#F5F2EE', padding: `80px ${pad} 48px`, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 56, alignItems: 'end' }}>
            <div>
              <div style={{ fontFamily: 'Network, cursive', fontSize: 'clamp(64px,10vw,160px)', lineHeight: 0.86, color: '#EF3537' }}>Gostou!?</div>
              <p style={{ fontFamily: 'ABCWhyte, sans-serif', fontWeight: 400, fontSize: 20, lineHeight: 1.3, margin: '16px 0 0', maxWidth: '28ch', color: '#F5F2EE' }}>
                Use os tokens, copie os componentes, mantenha a marca em qualquer canal.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                ['Source',    'davidhulle/portfolio'],
                ['Version',   'v2 · May 2026'],
                ['Contact',   'contato@davidhulle.com'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'ABCWhyte, sans-serif', fontSize: 14 }}>
                  <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>{k}</span>
                  <span style={{ color: '#FCDADA' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1', paddingTop: 28, fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.35, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span>DH Design System · v2 · May 2026</span>
              <span>© David Hulle · Built with intent</span>
            </div>
          </footer>

        </main>
        </div>{/* end padding wrapper */}
      </div>{/* end grid */}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DesignSystem() {
  const [unlocked, setUnlocked] = useState(false)
  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div key="gate" exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      ) : (
        <motion.div key="ds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <DesignSystemContent />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
