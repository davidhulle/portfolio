import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

// ─── Design Tokens ──────────────────────────────────────────────────────────

const BRAND_REDS = [
  { name: 'Red 50',  hex: '#FFF0F0' },
  { name: 'Red 100', hex: '#FFD6D6' },
  { name: 'Red 200', hex: '#FFADAD' },
  { name: 'Red 300', hex: '#FF7A8A' },
  { name: 'Red 400', hex: '#FF6B6B' },
  { name: 'Red 500', hex: '#EF3537', label: 'Brand' },
  { name: 'Red 600', hex: '#D41F21' },
  { name: 'Red 700', hex: '#9E0015', label: 'Crimson' },
  { name: 'Red 800', hex: '#7A0010' },
  { name: 'Red 900', hex: '#560009' },
]

const NEUTRALS = [
  { name: 'White',         hex: '#FFFFFF' },
  { name: 'Neutral 50',    hex: '#F5F2EE', label: 'BG Light' },
  { name: 'Neutral 100',   hex: '#F4F4F4' },
  { name: 'Neutral 200',   hex: '#E5E5E5' },
  { name: 'Neutral 300',   hex: '#D4D4D4' },
  { name: 'Neutral 400',   hex: '#999999' },
  { name: 'Neutral 500',   hex: '#777777' },
  { name: 'Neutral 600',   hex: '#666666' },
  { name: 'Neutral 700',   hex: '#333333' },
  { name: 'Neutral 800',   hex: '#1E1E1E' },
  { name: 'Neutral 900',   hex: '#141414' },
  { name: 'Neutral 950',   hex: '#101010' },
  { name: 'Black',         hex: '#0A0A0A', label: 'BG Dark' },
]

const SEMANTIC = [
  { name: 'Success 400', hex: '#4ADE80' },
  { name: 'Success 600', hex: '#16A34A' },
  { name: 'Warning 400', hex: '#FCD34D' },
  { name: 'Warning 600', hex: '#D97706' },
  { name: 'Info 400',    hex: '#60A5FA' },
  { name: 'Info 600',    hex: '#2563EB' },
  { name: 'Gold 400',    hex: '#F5C842' },
  { name: 'Gold 600',    hex: '#B8860B' },
]

const GRADIENTS = [
  { name: 'Brand',        css: 'linear-gradient(135deg, #9E0015 0%, #EF3537 50%, #FF6B6B 100%)' },
  { name: 'Hero',         css: 'linear-gradient(140deg, #9E0015 0%, #C41230 30%, #EF3537 65%, #FF4D6B 85%, #FF7A8A 100%)' },
  { name: 'Rose',         css: 'linear-gradient(135deg, #EF3537 0%, #FF7A8A 50%, #FFAAB5 100%)' },
  { name: 'Sunset',       css: 'linear-gradient(135deg, #9E0015 0%, #EF3537 50%, #D97706 100%)' },
  { name: 'Noir',         css: 'linear-gradient(135deg, #0A0A0A 0%, #1E1E1E 50%, #333333 100%)' },
  { name: 'Smoke',        css: 'linear-gradient(135deg, #333333 0%, #666666 100%)' },
  { name: 'Glass Dark',   css: 'linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(10,10,10,0.72) 100%)' },
  { name: 'Glass Light',  css: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(245,242,238,0.65) 100%)' },
]

const FONT_FAMILIES = [
  { name: 'Network',          var: 'Network, cursive',             role: 'Display',   sample: 'Portfolio' },
  { name: 'ABCWhyteInktrap',  var: 'ABCWhyteInktrap, sans-serif',  role: 'Accent',    sample: 'Card Heading' },
  { name: 'ABCWhyte',         var: 'ABCWhyte, sans-serif',         role: 'Heading',   sample: 'Section Title' },
  { name: 'ABCWhyteMono',     var: 'ABCWhyteMono, monospace',      role: 'Mono',      sample: 'Label & Tag' },
  { name: 'Inter',            var: 'Inter, sans-serif',            role: 'Body',      sample: 'Body text and descriptions for content areas.' },
]

const TYPE_SCALE = [
  { name: 'xs',   size: '11px', lh: '16px' },
  { name: 'sm',   size: '12px', lh: '18px' },
  { name: 'base', size: '14px', lh: '20px' },
  { name: 'md',   size: '16px', lh: '24px' },
  { name: 'lg',   size: '18px', lh: '28px' },
  { name: 'xl',   size: '20px', lh: '30px' },
  { name: '2xl',  size: '24px', lh: '32px' },
  { name: '3xl',  size: '32px', lh: '40px' },
  { name: '4xl',  size: '48px', lh: '56px' },
  { name: '5xl',  size: '64px', lh: '72px' },
]

const SPACING = [4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96, 120, 160, 200]

const RADII = [
  { name: 'none', value: '0px' },
  { name: 'sm',   value: '4px' },
  { name: 'base', value: '8px' },
  { name: 'md',   value: '10px' },
  { name: 'lg',   value: '12px' },
  { name: 'xl',   value: '16px' },
  { name: '2xl',  value: '24px' },
  { name: '3xl',  value: '40px' },
  { name: '4xl',  value: '50px' },
  { name: 'full', value: '100px' },
]

const SHADOWS = [
  { name: 'sm',  light: '0 2px 8px rgba(0,0,0,0.08)',   dark: '0 2px 8px rgba(0,0,0,0.35)' },
  { name: 'md',  light: '0 4px 16px rgba(0,0,0,0.1)',   dark: '0 4px 16px rgba(0,0,0,0.45)' },
  { name: 'lg',  light: '0 8px 32px rgba(0,0,0,0.12)',  dark: '0 8px 32px rgba(0,0,0,0.55)' },
  { name: 'xl',  light: '0 16px 48px rgba(0,0,0,0.15)', dark: '0 16px 48px rgba(0,0,0,0.65)' },
  { name: '2xl', light: '0 24px 64px rgba(0,0,0,0.2)',  dark: '0 24px 64px rgba(0,0,0,0.75)' },
  { name: 'red', light: '0 8px 32px rgba(239,53,55,0.25)', dark: '0 8px 32px rgba(239,53,55,0.4)' },
]

const EASINGS = [
  { name: 'smooth',   fm: [0.4, 0, 0.2, 1],     css: 'cubic-bezier(0.4, 0, 0.2, 1)',     desc: 'Standard UI transitions' },
  { name: 'expo-out', fm: [0.16, 1, 0.3, 1],    css: 'cubic-bezier(0.16, 1, 0.3, 1)',    desc: 'Entrance animations' },
  { name: 'bounce',   fm: [0.34, 1.56, 0.64, 1],css: 'cubic-bezier(0.34, 1.56, 0.64, 1)',desc: 'Playful interactions' },
  { name: 'ease-in',  fm: [0.4, 0, 1, 1],       css: 'cubic-bezier(0.4, 0, 1, 1)',       desc: 'Exit animations' },
  { name: 'ease-out', fm: [0, 0, 0.2, 1],       css: 'cubic-bezier(0, 0, 0.2, 1)',       desc: 'Deceleration' },
]

const DURATIONS = [
  { name: 'instant', value: '0.1s', desc: 'Micro-interactions' },
  { name: 'fast',    value: '0.2s', desc: 'Hover states' },
  { name: 'base',    value: '0.3s', desc: 'State changes' },
  { name: 'medium',  value: '0.5s', desc: 'Panel transitions' },
  { name: 'slow',    value: '0.7s', desc: 'Page transitions' },
  { name: 'slower',  value: '0.9s', desc: 'Hero entrances' },
]

// ─── Sub-components ─────────────────────────────────────────────────────────

function DSSection({ id, title, children, isDark }) {
  const muted = isDark ? 'rgba(245,242,238,0.4)' : 'rgba(10,10,10,0.4)'
  const divider = isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'
  return (
    <section id={id} style={{ marginBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontFamily: 'ABCWhyte, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: muted }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: divider }} />
      </div>
      {children}
    </section>
  )
}

function SubLabel({ children, isDark }) {
  return (
    <p style={{ margin: '0 0 14px', fontFamily: 'ABCWhyte, sans-serif', fontSize: 11, fontWeight: 500, color: isDark ? 'rgba(245,242,238,0.4)' : 'rgba(10,10,10,0.4)', letterSpacing: '0.06em' }}>
      {children}
    </p>
  )
}

function ColorSwatch({ name, hex, label, isDark }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div onClick={copy} title={`Copy ${hex}`} style={{ cursor: 'pointer' }}>
      <div style={{
        height: 60, borderRadius: 10,
        background: hex,
        border: `1px solid ${isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, overflow: 'hidden', position: 'relative',
      }}>
        <AnimatePresence>
          {copied && (
            <motion.div key="copied"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontSize: 10, color: '#fff', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600 }}>Copiado</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p style={{ margin: '0 0 2px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: isDark ? 'rgba(245,242,238,0.8)' : 'rgba(10,10,10,0.8)', lineHeight: 1.3 }}>
        {name}{label ? <span style={{ opacity: 0.5, fontWeight: 400 }}> — {label}</span> : null}
      </p>
      <p style={{ margin: 0, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.35)' : 'rgba(10,10,10,0.35)' }}>
        {hex}
      </p>
    </div>
  )
}

function GradientCard({ name, css, isDark }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div onClick={copy} style={{ cursor: 'pointer' }}>
      <div style={{
        height: 80, borderRadius: 12, background: css,
        border: `1px solid ${isDark ? 'rgba(245,242,238,0.08)' : 'rgba(10,10,10,0.08)'}`,
        marginBottom: 8, display: 'flex', alignItems: 'flex-end', padding: '8px 12px',
      }}>
        {copied && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600 }}>Copiado</span>}
      </div>
      <p style={{ margin: 0, fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: isDark ? 'rgba(245,242,238,0.75)' : 'rgba(10,10,10,0.75)' }}>{name}</p>
    </div>
  )
}

function EasingDemo({ name, fm, css, desc, isDark, cardBg, border, text }) {
  const [playing, setPlaying] = useState(false)
  const [key, setKey] = useState(0)

  function play() {
    setPlaying(false)
    setKey(k => k + 1)
    setTimeout(() => setPlaying(true), 16)
    setTimeout(() => setPlaying(false), 1400)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'clamp(100px,20%,160px) 1fr clamp(140px,30%,240px)',
      alignItems: 'center', gap: 16,
      padding: '14px 20px', borderRadius: 10,
      background: cardBg, border: `1px solid ${border}`,
      marginBottom: 2,
    }}>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: 12, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>{name}</p>
        <p style={{ margin: 0, fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: isDark ? 'rgba(245,242,238,0.4)' : 'rgba(10,10,10,0.4)' }}>{desc}</p>
      </div>
      <div
        key={key}
        onClick={play}
        title="Click to preview"
        style={{ height: 28, borderRadius: 4, background: isDark ? '#1A1A1A' : '#F0EEEB', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
      >
        <motion.div
          animate={playing ? { x: ['4px', 'calc(100% - 28px)'] } : { x: '4px' }}
          transition={{ duration: 0.8, ease: fm }}
          style={{ position: 'absolute', top: 4, width: 20, height: 20, borderRadius: 4, background: '#EF3537' }}
        />
      </div>
      <p style={{ margin: 0, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.3)' : 'rgba(10,10,10,0.3)', wordBreak: 'break-all', lineHeight: 1.5 }}>{css}</p>
    </div>
  )
}

function ComponentGroup({ title, children, isDark, cardBg, border }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <SubLabel isDark={isDark}>{title}</SubLabel>
      <div style={{ padding: '24px', borderRadius: 12, background: cardBg, border: `1px solid ${border}` }}>
        {children}
      </div>
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
    setError(true)
    setValue('')
    setTimeout(() => setError(false), 700)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24, transition: 'background 0.4s' }}>
      <motion.form
        onSubmit={handleSubmit}
        animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 320 }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: cardBg,
          border: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.07)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="11" width="16" height="11" rx="3" fill={text} opacity="0.85" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke={text} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
            <circle cx="12" cy="16.5" r="1.5" fill={bg} />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontFamily: 'ABCWhyte, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? 'rgba(245,242,238,0.32)' : 'rgba(10,10,10,0.32)' }}>
            David Hulle
          </p>
          <h1 style={{ margin: 0, fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 22, fontWeight: 700, color: text, lineHeight: 1.2 }}>
            Design System
          </h1>
        </div>

        <input
          type="password"
          placeholder="Senha de acesso"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '13px 16px',
            fontSize: 14, fontFamily: 'ABCWhyteMono, monospace',
            letterSpacing: '0.1em', textAlign: 'center',
            background: cardBg, color: text,
            border: `1.5px solid ${error ? '#EF3537' : border}`,
            borderRadius: 12, outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '13px 16px',
            fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600,
            letterSpacing: '0.04em',
            background: '#EF3537', color: '#FFFFFF',
            border: 'none', borderRadius: 12, cursor: 'pointer',
          }}
        >
          Entrar
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p key="err"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ margin: 0, color: '#EF3537', fontFamily: 'ABCWhyte, sans-serif', fontSize: 12 }}
            >
              Senha incorreta
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}

// ─── Design System Content ───────────────────────────────────────────────────

function DesignSystemContent() {
  const { isDark } = useTheme()
  const bg     = isDark ? '#0A0A0A' : '#F5F2EE'
  const text   = isDark ? '#F5F2EE' : '#0A0A0A'
  const cardBg = isDark ? '#141414' : '#FFFFFF'
  const border = isDark ? 'rgba(245,242,238,0.1)' : 'rgba(10,10,10,0.1)'
  const muted  = isDark ? 'rgba(245,242,238,0.5)' : 'rgba(10,10,10,0.5)'

  const [toggleOn, setToggleOn] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [radioVal, setRadioVal] = useState('a')

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, transition: 'background-color 0.4s ease, color 0.4s ease' }}>

      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: isDark ? 'rgba(10,10,10,0.88)' : 'rgba(245,242,238,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${border}`,
        padding: '0 clamp(24px,6vw,80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 54,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, fontSize: 15, color: text }}>Design System</span>
          <span style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', padding: '2px 8px', borderRadius: 100, background: 'rgba(239,53,55,0.12)', color: '#EF3537' }}>v1.0</span>
        </div>
        <span style={{ fontFamily: 'ABCWhyte, sans-serif', fontSize: 11, color: isDark ? 'rgba(245,242,238,0.3)' : 'rgba(10,10,10,0.3)' }}>
          davidhulle.com · 2026
        </span>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(48px,8vw,96px) clamp(24px,6vw,80px)' }}>

        {/* Page heading */}
        <div style={{ marginBottom: 80 }}>
          <p style={{ margin: '0 0 12px', fontFamily: 'ABCWhyte, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? 'rgba(245,242,238,0.35)' : 'rgba(10,10,10,0.35)' }}>
            David Hulle
          </p>
          <h1 style={{ margin: '0 0 16px', fontFamily: 'Network, cursive', fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 400, color: text, lineHeight: 1 }}>
            Design System
          </h1>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.7, color: muted, maxWidth: 520 }}>
            Tokens de design, componentes e padrões visuais do portfolio. Clique nos swatches de cor para copiar o valor hex.
          </p>
        </div>

        {/* ════ COLORS ════ */}
        <DSSection id="colors" title="Colors" isDark={isDark}>

          <SubLabel isDark={isDark}>Brand — Red Scale</SubLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12, marginBottom: 40 }}>
            {BRAND_REDS.map(c => <ColorSwatch key={c.hex} {...c} isDark={isDark} />)}
          </div>

          <SubLabel isDark={isDark}>Neutrals</SubLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12, marginBottom: 40 }}>
            {NEUTRALS.map(c => <ColorSwatch key={c.hex} {...c} isDark={isDark} />)}
          </div>

          <SubLabel isDark={isDark}>Semantic & Complementary</SubLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12, marginBottom: 40 }}>
            {SEMANTIC.map(c => <ColorSwatch key={c.hex} {...c} isDark={isDark} />)}
          </div>

          <SubLabel isDark={isDark}>Gradients — clique para copiar</SubLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {GRADIENTS.map(g => <GradientCard key={g.name} {...g} isDark={isDark} />)}
          </div>
        </DSSection>

        {/* ════ TYPOGRAPHY ════ */}
        <DSSection id="typography" title="Typography" isDark={isDark}>

          <SubLabel isDark={isDark}>Font Families</SubLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 40 }}>
            {FONT_FAMILIES.map(f => (
              <div key={f.name} style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(80px,18%,140px) 1fr auto',
                alignItems: 'center', gap: 20,
                padding: '16px 20px', borderRadius: 10,
                background: cardBg, border: `1px solid ${border}`,
              }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.role}</p>
                  <p style={{ margin: 0, fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>{f.name}</p>
                </div>
                <p style={{ margin: 0, fontSize: 20, fontFamily: f.var, color: text, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{f.sample}</p>
                <p style={{ margin: 0, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.25)' : 'rgba(10,10,10,0.25)', whiteSpace: 'nowrap' }}>{f.var.split(',')[0]}</p>
              </div>
            ))}
          </div>

          <SubLabel isDark={isDark}>Type Scale — ABCWhyte</SubLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TYPE_SCALE.map(t => (
              <div key={t.name} style={{
                display: 'grid', gridTemplateColumns: '48px 48px 1fr',
                alignItems: 'baseline', gap: 16,
                padding: '10px 0',
                borderBottom: `1px solid ${border}`,
              }}>
                <span style={{ fontSize: 10, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.3)' : 'rgba(10,10,10,0.3)' }}>{t.name}</span>
                <span style={{ fontSize: 10, fontFamily: 'ABCWhyteMono, monospace', color: isDark ? 'rgba(245,242,238,0.3)' : 'rgba(10,10,10,0.3)' }}>{t.size}</span>
                <span style={{ fontSize: t.size, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 400, color: text, lineHeight: t.lh, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </DSSection>

        {/* ════ SPACING ════ */}
        <DSSection id="spacing" title="Spacing" isDark={isDark}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end' }}>
            {SPACING.map(s => {
              const visual = Math.min(s, 80)
              return (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: visual, height: visual, background: '#EF3537', borderRadius: 3, opacity: 0.75 }} />
                  <span style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted }}>{s}px</span>
                </div>
              )
            })}
          </div>
        </DSSection>

        {/* ════ BORDER RADIUS ════ */}
        <DSSection id="radius" title="Border Radius" isDark={isDark}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
            {RADII.map(r => (
              <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 64, height: 64,
                  background: isDark ? '#1E1E1E' : '#E5E5E5',
                  borderRadius: r.value,
                  border: `2px solid ${isDark ? 'rgba(245,242,238,0.12)' : 'rgba(10,10,10,0.12)'}`,
                }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted }}>{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </DSSection>

        {/* ════ SHADOWS ════ */}
        <DSSection id="shadows" title="Shadows" isDark={isDark}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24 }}>
            {SHADOWS.map(s => (
              <div key={s.name}>
                <div style={{
                  height: 80, borderRadius: 12,
                  background: cardBg,
                  boxShadow: isDark ? s.dark : s.light,
                  marginBottom: 12,
                }} />
                <p style={{ margin: '0 0 3px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>shadow-{s.name}</p>
                <p style={{ margin: 0, fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted, wordBreak: 'break-word', lineHeight: 1.5 }}>{isDark ? s.dark : s.light}</p>
              </div>
            ))}
          </div>
        </DSSection>

        {/* ════ MOTION ════ */}
        <DSSection id="motion" title="Motion" isDark={isDark}>
          <SubLabel isDark={isDark}>Easing Functions — clique para animar</SubLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 40 }}>
            {EASINGS.map(e => (
              <EasingDemo key={e.name} {...e} isDark={isDark} cardBg={cardBg} border={border} text={text} />
            ))}
          </div>

          <SubLabel isDark={isDark}>Duration Scale</SubLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {DURATIONS.map(d => (
              <div key={d.name} style={{ padding: '16px 18px', borderRadius: 10, background: cardBg, border: `1px solid ${border}` }}>
                <p style={{ margin: '0 0 4px', fontSize: 28, fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, color: '#EF3537', lineHeight: 1 }}>{d.value}</p>
                <p style={{ margin: '0 0 2px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: text }}>{d.name}</p>
                <p style={{ margin: 0, fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </DSSection>

        {/* ════ COMPONENTS ════ */}
        <DSSection id="components" title="Components" isDark={isDark}>

          {/* Buttons */}
          <ComponentGroup title="Buttons — Variants" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <button style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#EF3537', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Primary</button>
              <button style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: 'transparent', color: text, border: `1.5px solid ${isDark ? 'rgba(245,242,238,0.2)' : 'rgba(10,10,10,0.2)'}`, borderRadius: 8, cursor: 'pointer' }}>Secondary</button>
              <button style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: 'transparent', color: '#EF3537', border: '1.5px solid #EF3537', borderRadius: 8, cursor: 'pointer' }}>Ghost</button>
              <button style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: isDark ? '#F5F2EE' : '#0A0A0A', color: isDark ? '#0A0A0A' : '#F5F2EE', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Inverted</button>
              <button style={{ padding: '11px 20px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: 'linear-gradient(135deg, #9E0015, #EF3537)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Gradient</button>
              <button disabled style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: isDark ? '#1E1E1E' : '#E5E5E5', color: isDark ? 'rgba(245,242,238,0.25)' : 'rgba(10,10,10,0.25)', border: 'none', borderRadius: 8, cursor: 'not-allowed' }}>Disabled</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted, marginRight: 4 }}>Sizes:</span>
              <button style={{ padding: '7px 14px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#EF3537', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Small</button>
              <button style={{ padding: '11px 22px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#EF3537', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Medium</button>
              <button style={{ padding: '14px 28px', fontSize: 15, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#EF3537', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Large</button>
              <button style={{ padding: '18px 40px', fontSize: 16, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#EF3537', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>XLarge</button>
            </div>
          </ComponentGroup>

          {/* Tags & Badges */}
          <ComponentGroup title="Tags & Badges" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: 'rgba(239,53,55,0.12)', color: '#EF3537', borderRadius: 100 }}>Brand</span>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: 'transparent', color: text, border: `1px solid ${border}`, borderRadius: 100 }}>Outline</span>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: isDark ? '#1E1E1E' : '#F0EEEB', color: text, borderRadius: 100 }}>Neutral</span>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: 'rgba(34,197,94,0.12)', color: '#16A34A', borderRadius: 100 }}>Success</span>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: 'rgba(245,158,11,0.12)', color: '#D97706', borderRadius: 100 }}>Warning</span>
              <span style={{ padding: '4px 12px', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, background: 'rgba(59,130,246,0.12)', color: '#2563EB', borderRadius: 100 }}>Info</span>
              <span style={{ padding: '3px 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: '#0A0A0A', color: '#F5F2EE', borderRadius: 6 }}>Dark pill</span>
              <span style={{ padding: '3px 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, background: 'linear-gradient(135deg,#9E0015,#EF3537)', color: '#fff', borderRadius: 100 }}>Gradient</span>
              <span style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'ABCWhyteMono, monospace', background: isDark ? '#1A1A1A' : '#F4F4F4', color: text, borderRadius: 4, border: `1px solid ${border}` }}>code</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                <span style={{ fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: '#16A34A' }}>Live</span>
              </div>
            </div>
          </ComponentGroup>

          {/* Cards */}
          <ComponentGroup title="Cards" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {/* Default */}
              <div style={{ padding: 24, borderRadius: 16, background: isDark ? '#1A1A1A' : '#FAFAFA', border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)' }}>
                <span style={{ display: 'block', marginBottom: 8, fontSize: 9, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#EF3537' }}>Default</span>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 17, fontWeight: 700, color: text }}>Card Title</h3>
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.6, color: muted }}>A description that provides context about this card's content.</p>
              </div>
              {/* Glass */}
              <div style={{ padding: 24, borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: `1px solid ${border}` }}>
                <span style={{ display: 'block', marginBottom: 8, fontSize: 9, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>Glass</span>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 17, fontWeight: 700, color: text }}>Glassmorphism</h3>
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.6, color: muted }}>Blur, transparency and depth.</p>
              </div>
              {/* Brand */}
              <div style={{ padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, #9E0015 0%, #EF3537 100%)' }}>
                <span style={{ display: 'block', marginBottom: 8, fontSize: 9, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Brand</span>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff' }}>Gradient Card</h3>
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>High-emphasis surface for CTAs.</p>
              </div>
              {/* Metric */}
              <div style={{ padding: 24, borderRadius: 16, background: isDark ? '#1A1A1A' : '#FAFAFA', border: `1px solid ${border}` }}>
                <p style={{ margin: '0 0 2px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Metric</p>
                <p style={{ margin: '0 0 4px', fontSize: 48, fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, color: '#EF3537', lineHeight: 1 }}>79%</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: 'Inter, sans-serif', color: muted }}>Conversion rate increase</p>
              </div>
            </div>
          </ComponentGroup>

          {/* Inputs */}
          <ComponentGroup title="Form Inputs" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: muted, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Default</label>
                <input type="text" placeholder="Placeholder" value={inputVal} onChange={e => setInputVal(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', background: bg, color: text, border: `1.5px solid ${border}`, borderRadius: 10, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: '#EF3537', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Error</label>
                <input type="text" defaultValue="Valor inválido" readOnly
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', background: isDark ? '#1a0808' : '#FFF0F0', color: '#EF3537', border: '1.5px solid #EF3537', borderRadius: 10, outline: 'none' }} />
                <p style={{ margin: '4px 0 0', fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', color: '#EF3537' }}>Este campo é obrigatório</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: isDark ? 'rgba(245,242,238,0.25)' : 'rgba(10,10,10,0.25)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Disabled</label>
                <input type="text" defaultValue="Não editável" disabled
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', background: isDark ? '#111' : '#F0EEEB', color: isDark ? 'rgba(245,242,238,0.2)' : 'rgba(10,10,10,0.2)', border: `1.5px solid ${isDark ? 'rgba(245,242,238,0.05)' : 'rgba(10,10,10,0.07)'}`, borderRadius: 10, outline: 'none', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 600, color: muted, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Select</label>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', background: bg, color: text, border: `1.5px solid ${border}`, borderRadius: 10, outline: 'none', cursor: 'pointer' }}>
                  <option>Opção 1</option>
                  <option>Opção 2</option>
                  <option>Opção 3</option>
                </select>
              </div>
            </div>
          </ComponentGroup>

          {/* Toggle & Checkbox */}
          <ComponentGroup title="Toggle & Checkbox" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
              {/* Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <motion.div
                  onClick={() => setToggleOn(p => !p)}
                  style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: toggleOn ? '#EF3537' : (isDark ? '#333' : '#D4D4D4'), display: 'flex', alignItems: 'center', padding: '0 3px', transition: 'background 0.2s' }}
                >
                  <motion.div
                    animate={{ x: toggleOn ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                  />
                </motion.div>
                <span style={{ fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', color: text }}>{toggleOn ? 'Ativo' : 'Inativo'}</span>
              </div>
              {/* Checkboxes */}
              {[true, false].map((checked, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: checked ? '#EF3537' : 'transparent',
                    border: `2px solid ${checked ? '#EF3537' : border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', color: text }}>{checked ? 'Marcado' : 'Desmarcado'}</span>
                </label>
              ))}
              {/* Radio */}
              {['Opção A', 'Opção B'].map((opt, i) => {
                const val = i === 0 ? 'a' : 'b'
                const active = radioVal === val
                return (
                  <label key={opt} onClick={() => setRadioVal(val)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: `2px solid ${active ? '#EF3537' : border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF3537' }} />}
                    </div>
                    <span style={{ fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', color: text }}>{opt}</span>
                  </label>
                )
              })}
            </div>
          </ComponentGroup>

          {/* Avatar */}
          <ComponentGroup title="Avatar" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
              {[20, 28, 36, 48, 64, 80].map(size => (
                <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: size, height: size, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9E0015, #EF3537)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontFamily: 'ABCWhyteInktrap, sans-serif',
                    fontWeight: 700, fontSize: Math.round(size * 0.36),
                    flexShrink: 0,
                  }}>
                    {size >= 28 ? 'DH' : 'D'}
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted }}>{size}</span>
                </div>
              ))}
              {/* With ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #9E0015, #EF3537)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'ABCWhyteInktrap, sans-serif', fontWeight: 700, fontSize: 17, outline: '2.5px solid #EF3537', outlineOffset: 3 }}>DH</div>
                <span style={{ fontSize: 9, fontFamily: 'ABCWhyteMono, monospace', color: muted }}>ring</span>
              </div>
            </div>
          </ComponentGroup>

          {/* Dividers */}
          <ComponentGroup title="Dividers" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 480 }}>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>Default 1px</p>
                <div style={{ height: 1, background: border }} />
              </div>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>Brand accent</p>
                <div style={{ height: 2, width: 48, background: '#EF3537', borderRadius: 1 }} />
              </div>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>With label</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1, height: 1, background: border }} />
                  <span style={{ fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', color: muted, whiteSpace: 'nowrap' }}>Section</span>
                  <div style={{ flex: 1, height: 1, background: border }} />
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>Gradient</p>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #EF3537, transparent)' }} />
              </div>
            </div>
          </ComponentGroup>

          {/* Progress */}
          <ComponentGroup title="Progress Bars" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 500 }}>
              {[25, 50, 75, 100].map(pct => (
                <div key={pct}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>Progress</span>
                    <span style={{ fontSize: 11, fontFamily: 'ABCWhyteMono, monospace', color: pct === 100 ? '#16A34A' : '#EF3537' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: isDark ? '#1E1E1E' : '#E5E5E5' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: pct * 0.005, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', borderRadius: 2, background: pct === 100 ? '#16A34A' : '#EF3537' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ComponentGroup>

          {/* Tooltip */}
          <ComponentGroup title="Tooltip" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, paddingTop: 12, paddingBottom: 12 }}>
              {[
                { label: 'Dark',    bg: '#0A0A0A',  color: '#F5F2EE', brd: 'none' },
                { label: 'Light',   bg: '#FFFFFF',  color: '#0A0A0A', brd: `1px solid ${border}` },
                { label: 'Brand',   bg: '#EF3537',  color: '#FFFFFF', brd: 'none' },
              ].map(v => (
                <div key={v.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    padding: '7px 13px', borderRadius: 7, fontSize: 11,
                    fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500,
                    background: v.bg, color: v.color, border: v.brd,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}>
                    Tooltip text
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'ABCWhyte, sans-serif', color: muted }}>{v.label}</span>
                </div>
              ))}
            </div>
          </ComponentGroup>

          {/* Navigation Items */}
          <ComponentGroup title="Navigation" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 16 }}>
              {['Home', 'Projetos', 'Sobre', 'Jornada', 'Skills', 'Contato'].map((item, i) => (
                <span key={item} style={{
                  padding: '8px 14px', fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? '#EF3537' : text,
                  borderBottom: `1.5px solid ${i === 0 ? '#EF3537' : 'transparent'}`,
                  cursor: 'pointer',
                }}>
                  {item}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Home', 'Projetos', 'Sobre'].map((item, i) => (
                <span key={item} style={{
                  padding: '8px 16px', fontSize: 12, fontFamily: 'ABCWhyte, sans-serif', fontWeight: 500,
                  borderRadius: 8, cursor: 'pointer',
                  background: i === 0 ? 'rgba(239,53,55,0.1)' : 'transparent',
                  color: i === 0 ? '#EF3537' : text,
                  border: `1px solid ${i === 0 ? 'rgba(239,53,55,0.2)' : border}`,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </ComponentGroup>

          {/* Breadcrumb */}
          <ComponentGroup title="Breadcrumb" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {['Início', 'Projetos', 'Mercado Pago'].map((item, i, arr) => (
                <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', fontWeight: i === arr.length - 1 ? 600 : 400, color: i === arr.length - 1 ? text : muted, cursor: i < arr.length - 1 ? 'pointer' : 'default' }}>{item}</span>
                  {i < arr.length - 1 && <span style={{ fontSize: 12, color: isDark ? 'rgba(245,242,238,0.2)' : 'rgba(10,10,10,0.2)' }}>/</span>}
                </span>
              ))}
            </div>
          </ComponentGroup>

          {/* Alert / Banner */}
          <ComponentGroup title="Alerts & Banners" isDark={isDark} cardBg={cardBg} border={border}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { type: 'Success', bg: 'rgba(34,197,94,0.1)',  border: '1px solid rgba(34,197,94,0.25)',  color: '#16A34A', icon: '✓' },
                { type: 'Warning', bg: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#D97706', icon: '!' },
                { type: 'Info',    bg: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#2563EB', icon: 'i' },
                { type: 'Error',   bg: 'rgba(239,53,55,0.08)', border: '1px solid rgba(239,53,55,0.2)',   color: '#EF3537', icon: '✕' },
              ].map(a => (
                <div key={a.type} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: a.bg, border: a.border }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{a.icon}</span>
                  <p style={{ margin: 0, fontSize: 13, fontFamily: 'ABCWhyte, sans-serif', color: a.color }}>
                    <strong>{a.type}:</strong> Mensagem de feedback para o usuário.
                  </p>
                </div>
              ))}
            </div>
          </ComponentGroup>

        </DSSection>

        {/* ── Footer ── */}
        <div style={{ paddingTop: 40, borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'ABCWhyteInktrap, sans-serif', fontSize: 15, fontWeight: 700, color: text }}>David Hulle</span>
          <span style={{ fontFamily: 'ABCWhyteMono, monospace', fontSize: 10, color: isDark ? 'rgba(245,242,238,0.25)' : 'rgba(10,10,10,0.25)' }}>Design System v1.0 · 2026</span>
        </div>

      </div>
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
