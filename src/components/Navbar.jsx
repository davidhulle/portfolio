import { useState, useEffect, useCallback, useRef, useId } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'
import { trackEvent } from '../lib/analytics'

const LANGUAGES = [
  { code: 'PT', label: 'Português' },
  { code: 'EN', label: 'Inglês'    },
  { code: 'ES', label: 'Espanhol'  },
]

/* ── Config ── */
const ALL_SECTIONS      = ['hero', 'projetos', 'sobre', 'skills', 'recomendacoes', 'jornada', 'mp-quote', 'contato']
const DARK_SECTIONS     = new Set(['hero', 'recomendacoes', 'contato'])
const FORCE_TRANSPARENT = new Set(['hero', 'recomendacoes', 'contato'])

const NAV_KEYS = [
  { key: 'nav.home',            href: '#hero' },
  { key: 'nav.projects',        href: '#projetos' },
  { key: 'nav.about',           href: '#sobre' },
  { key: 'nav.skills',          href: '#skills' },
  { key: 'nav.recommendations', href: '#recomendacoes' },
  { key: 'nav.journey',         href: '#jornada' },
  { key: 'nav.contact',         href: '#contato' },
]


/* ── Hover helpers (NavigationButton + NavigationIconButton spec) ──
   Hover state is always: bg rgba(10,10,10,0.8) + white text/icon        */
function navLinkHover(restoreBg, restoreColor) {
  return {
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(10,10,10,0.8)'
      e.currentTarget.style.color      = '#ffffff'
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = restoreBg
      e.currentTarget.style.color      = restoreColor
    },
  }
}

function iconBtnHover(restoreBg, restoreColor) {
  return {
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(10,10,10,0.8)'
      e.currentTarget.style.color      = '#ffffff'
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = restoreBg
      e.currentTarget.style.color      = restoreColor
    },
  }
}

/* ── Animated sun ↔ moon icon (spring physics + SVG mask) ── */
function AnimatedThemeIcon({ isDark }) {
  const id      = useId()
  const maskId  = `att${id.replace(/:/g, '')}`
  const isFirst = useRef(true)
  const moon    = !isDark  // moon in light mode, sun in dark mode

  useEffect(() => {
    requestAnimationFrame(() => { isFirst.current = false })
  }, [])

  const spring = isFirst.current
    ? { duration: 0 }
    : { type: 'spring', stiffness: 380, damping: 30 }

  return (
    <motion.svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      initial={false}
      animate={{ rotate: moon ? 270 : 0 }}
      transition={spring}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <mask id={maskId}>
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <motion.circle
          initial={false}
          animate={{ cx: moon ? 17 : 33, cy: moon ? 8 : 0 }}
          transition={spring}
          r="9"
          fill="black"
        />
      </mask>

      <motion.circle
        cx="12" cy="12"
        fill="currentColor" stroke="none"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: moon ? 9 : 5 }}
        transition={spring}
      />

      <motion.g
        initial={false}
        animate={{ opacity: moon ? 0 : 1, scale: moon ? 0 : 1, rotate: moon ? -30 : 0 }}
        transition={spring}
        style={{ transformOrigin: '12px 12px' }}
      >
        <line x1="12" y1="1"    x2="12" y2="3"    />
        <line x1="12" y1="21"   x2="12" y2="23"   />
        <line x1="1"  y1="12"   x2="3"  y2="12"   />
        <line x1="21" y1="12"   x2="23" y2="12"   />
        <line x1="5.64"  y1="5.64"  x2="4.22"  y2="4.22"  />
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
        <line x1="5.64"  y1="18.36" x2="4.22"  y2="19.78" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      </motion.g>
    </motion.svg>
  )
}

function ChevronIcon({ size = 10, open }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 8h16M4 16h16" strokeLinecap="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  )
}

/* Ícone animado: hamburger ↔ X via morph de path SVG */
function AnimatedMenuIcon({ isOpen }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <motion.path
        strokeLinecap="round"
        initial={false}
        animate={{ d: isOpen ? 'M18 6 L6 18' : 'M4 8 L20 8' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        strokeLinecap="round"
        initial={false}
        animate={{ d: isOpen ? 'M6 6 L18 18' : 'M4 16 L20 16' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

function LangSelect({ lang, setLang, pillBg, textColor, size = 'sm' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const sm = size === 'sm'

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Selecionar idioma"
        aria-expanded={open}
        style={{
          ...btnReset,
          gap:           sm ? 6 : 8,
          height:        sm ? 32 : 'auto',
          padding:       sm ? '0 10px' : '8px',
          borderRadius:  8,
          background:    open ? 'rgba(10,10,10,0.8)' : pillBg,
          fontFamily:    "'ABCWhyteInktrap', sans-serif",
          fontSize:      sm ? 12 : 16,
          fontWeight:    700,
          letterSpacing: sm ? '0.6px' : '0.8px',
          color:         open ? '#ffffff' : textColor,
          whiteSpace:    'nowrap',
        }}
      >
        <GlobeIcon size={sm ? 16 : 20} />
        {lang}
        <ChevronIcon size={sm ? 10 : 12} open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Idiomas disponíveis"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            style={{
              position:             'absolute',
              top:                  'calc(100% + 8px)',
              left:                 0,
              minWidth:             148,
              borderRadius:         10,
              background:           'rgba(12,12,12,0.95)',
              backdropFilter:       'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border:               '1px solid rgba(255,255,255,0.1)',
              padding:              4,
              zIndex:               200,
              listStyle:            'none',
              margin:               0,
            }}
          >
            {LANGUAGES.map(({ code, label }) => {
              const isActive = code === lang
              return (
                <li key={code} role="option" aria-selected={isActive}>
                  <button
                    onClick={() => { setLang(code); setOpen(false); trackEvent('language_change', { language: code }) }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                    style={{
                      ...btnReset,
                      width:          '100%',
                      justifyContent: 'flex-start',
                      gap:            10,
                      padding:        '7px 10px',
                      borderRadius:   7,
                      fontFamily:     "'ABCWhyteInktrap', sans-serif",
                      fontSize:       12,
                      fontWeight:     700,
                      letterSpacing:  '0.5px',
                      color:          '#ffffff',
                      background:     isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    <span style={{ minWidth: 24 }}>{code}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 400 }}>{label}</span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Base button reset ── */
const btnReset = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  border:         'none',
  cursor:         'pointer',
  flexShrink:     0,
  transition:     'background 0.15s, color 0.15s',
}

export default function Navbar() {
  const { isDark, toggle }               = useTheme()
  const { lang, setLang, t }             = useLang()
  const location                         = useLocation()
  const navigate                         = useNavigate()
  const isHome                           = location.pathname === '/'
  const [scrolled, setScrolled]          = useState(false)
  const [menuOpen, setMenuOpen]          = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [overDarkBand, setOverDarkBand]  = useState(false)
  const [waveOrigin, setWaveOrigin]      = useState('calc(100% - 64px) 56px')
  const [langSheetOpen, setLangSheetOpen] = useState(false)
  const menuBtnRef                       = useRef(null)

  useEffect(() => {
    if (!menuOpen) setLangSheetOpen(false)
  }, [menuOpen])

  useEffect(() => {
    /* Home: blur após 40px (forceTransparent mantém transparente sobre seções escuras).
       Projeto: blur só após o hero completo (100svh) sair da viewport. */
    const threshold = () => isHome ? 40 : window.innerHeight * 0.9
    const fn = () => setScrolled(window.scrollY > threshold())
    window.addEventListener('scroll', fn, { passive: true })
    window.addEventListener('resize', fn, { passive: true })
    fn() // sincroniza imediatamente ao montar ou trocar de página
    return () => {
      window.removeEventListener('scroll', fn)
      window.removeEventListener('resize', fn)
    }
  }, [isHome])

  useEffect(() => {
    const checkDarkBand = () => {
      const el = document.getElementById('mp-quote')
      if (!el) { setOverDarkBand(false); return }
      const { top, bottom } = el.getBoundingClientRect()
      setOverDarkBand(top <= 80 && bottom > 0)
    }
    window.addEventListener('scroll', checkDarkBand, { passive: true })
    checkDarkBand()
    return () => window.removeEventListener('scroll', checkDarkBand)
  }, [location.pathname])

  useEffect(() => {
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.35
      let cur = ALL_SECTIONS[0]
      ALL_SECTIONS.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) cur = id
      })
      setActiveSection(cur)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = useCallback(href => {
    setMenuOpen(false)
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { anchor: href } })
    }
  }, [isHome, navigate])

  /* ── Variant ──
     Home:    força transparência sobre hero/recs/contato; texto branco sobre seções escuras
     Projeto: transparente sobre hero (texto sempre escuro); blur + tema ao scrollar       */
  const GLOBAL_DARK      = activeSection === 'contato' || overDarkBand
  const forceTransparent = GLOBAL_DARK || (isHome && FORCE_TRANSPARENT.has(activeSection))
  const onDarkSection    = isHome && DARK_SECTIONS.has(activeSection) && !scrolled
  const isBlurred        = !forceTransparent && scrolled
  const whiteText        = isHome
    ? (forceTransparent || onDarkSection || isDark)
    : (forceTransparent || (isBlurred && isDark))
  const headerBg    = isBlurred
    ? (isDark ? 'rgba(16,16,16,0.6)' : 'rgba(255,255,255,0.9)')
    : 'transparent'

  const textColor   = whiteText ? '#ffffff' : '#0a0a0a'
  const activeColor = (isBlurred && !isDark) ? '#ef3537' : textColor
  const pillActive  = whiteText ? 'rgba(245,245,245,0.25)' : 'rgba(10,10,10,0.05)'
  const pillUtil    = whiteText ? 'rgba(245,245,245,0.25)' : 'rgba(10,10,10,0.05)'
  const dividerClr  = whiteText ? 'rgba(255,255,255,0.25)' : 'rgba(10,10,10,0.2)'

  const logoFilter = (() => {
    if (isBlurred && !isDark)
      return 'brightness(0) saturate(100%) invert(27%) sepia(87%) saturate(3548%) hue-rotate(347deg) brightness(96%)'
    return whiteText ? 'brightness(0) invert(1)' : 'brightness(0)'
  })()

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:             'fixed',
          top: 0, left: 0, right: 0,
          zIndex:               50,
          backgroundColor:      headerBg,
          backdropFilter:       isBlurred ? 'blur(20px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: isBlurred ? 'blur(20px) saturate(1.5)' : 'none',
          transition:           'background-color 0.3s ease',
        }}
      >
        {/* ═══ Desktop nav ═══ */}
        <nav
          className="hidden lg:flex items-end justify-between"
          style={{ maxWidth: '1920px', margin: '0 auto', paddingTop: 32, paddingBottom: 16, paddingLeft: '8%', paddingRight: '8%' }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={e => { e.preventDefault(); handleNav('#hero') }}
            aria-label="David Hulle — Início"
            style={{ flexShrink: 0, lineHeight: 0 }}
          >
            <img
              src="/logos/logo-simbolo.svg"
              alt="D"
              style={{ height: 32, width: 'auto', filter: logoFilter, transition: 'filter 0.3s ease', display: 'block' }}
            />
          </a>

          {/* Right group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Nav links — NavigationButton Small */}
            <LayoutGroup id="desktop-nav">
              {NAV_KEYS.map(link => {
                const active  = isHome && '#' + activeSection === link.href
                const restClr = active ? activeColor : textColor
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    onMouseEnter={e => {
                      e.currentTarget.querySelector('.nav-hl').style.background = 'rgba(10,10,10,0.8)'
                      e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.querySelector('.nav-hl').style.background = 'transparent'
                      e.currentTarget.style.color = restClr
                    }}
                    style={{
                      ...btnReset,
                      position:      'relative',
                      height:        32,
                      padding:       '0 8px',
                      borderRadius:  8,
                      background:    'transparent',
                      fontFamily:    "'ABCWhyteInktrap', sans-serif",
                      fontSize:      12,
                      fontWeight:    700,
                      letterSpacing: '0.6px',
                      color:         restClr,
                      whiteSpace:    'nowrap',
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        style={{ position: 'absolute', inset: 0, borderRadius: 8, background: pillActive, zIndex: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                      />
                    )}
                    {/* hover overlay — sits above the pill so hover always wins */}
                    <div className="nav-hl" style={{ position: 'absolute', inset: 0, borderRadius: 8, background: 'transparent', zIndex: 1, pointerEvents: 'none' }} />
                    <span style={{ position: 'relative', zIndex: 2 }}>{t(link.key)}</span>
                  </button>
                )
              })}
            </LayoutGroup>


            {/* Divider */}
            <div style={{ width: 1, height: 16, background: dividerClr, margin: '0 8px', flexShrink: 0 }} />

            {/* Theme toggle — NavigationIconButton Small
                Small: padding 8px, no fixed size → 20px icon + 8+8 = 36px */}
            <button
              onClick={toggle}
              aria-label="Alternar tema"
              {...iconBtnHover(pillUtil, textColor)}
              style={{
                ...btnReset,
                padding:      8,
                borderRadius: '50%',
                background:   pillUtil,
                color:        textColor,
              }}
            >
              <AnimatedThemeIcon isDark={isDark} />
            </button>

            {/* Language select */}
            <LangSelect lang={lang} setLang={setLang} pillBg={pillUtil} textColor={textColor} size="sm" />

          </div>
        </nav>

        {/* ═══ Mobile header ═══ */}
        <div
          className="flex lg:hidden"
          style={{ padding: '16px 24px 0' }}
        >
          <div
            style={{
              flex:           1,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '16px 16px 16px 24px',
              borderRadius:   80,
            }}
          >
            {/* Logo */}
            <a
              href="#hero"
              onClick={e => { e.preventDefault(); handleNav('#hero') }}
              aria-label="David Hulle — Início"
              style={{ lineHeight: 0, flexShrink: 0 }}
            >
              <img
                src="/logos/logo-simbolo.svg"
                alt="D"
                style={{ height: 40, width: 'auto', filter: logoFilter, transition: 'filter 0.3s ease', display: 'block' }}
              />
            </a>

            {/* Controls — NavigationIconButton Medium: 48×48px, padding 12px */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={toggle}
                aria-label="Alternar tema"
                {...iconBtnHover(pillUtil, textColor)}
                style={{
                  ...btnReset,
                  width:        48,
                  height:       48,
                  padding:      12,
                  borderRadius: '50%',
                  background:   pillUtil,
                  color:        textColor,
                }}
              >
                <AnimatedThemeIcon isDark={isDark} />
              </button>
              <button
                ref={menuBtnRef}
                onClick={() => {
                  if (menuBtnRef.current) {
                    const rect = menuBtnRef.current.getBoundingClientRect()
                    setWaveOrigin(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`)
                  }
                  setMenuOpen(o => !o)
                }}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                {...iconBtnHover(pillUtil, textColor)}
                style={{
                  ...btnReset,
                  width:        48,
                  height:       48,
                  padding:      12,
                  borderRadius: '50%',
                  background:   pillUtil,
                  color:        textColor,
                }}
              >
                <AnimatedMenuIcon isOpen={menuOpen} />
              </button>
            </div>
          </div>
        </div>

      </motion.header>

      {/* ═══ Mobile full-screen menu ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: `circle(0vmax at ${waveOrigin})` }}
            animate={{ clipPath: `circle(150vmax at ${waveOrigin})` }}
            exit={{
              clipPath: `circle(0vmax at ${waveOrigin})`,
              transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
            }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:        'fixed',
              inset:           0,
              zIndex:          100,
              backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
              display:         'flex',
              flexDirection:   'column',
            }}
          >
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ delay: 0.18, duration: 0.22 }}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '32px 40px 16px 48px',
                flexShrink:     0,
              }}
            >
              {/* Language trigger → opens bottom sheet */}
              <button
                onClick={() => setLangSheetOpen(true)}
                aria-label="Selecionar idioma"
                aria-haspopup="dialog"
                aria-expanded={langSheetOpen}
                style={{
                  ...btnReset,
                  gap:           8,
                  padding:       '8px 12px',
                  borderRadius:  8,
                  background:    langSheetOpen
                    ? 'rgba(10,10,10,0.8)'
                    : (isDark ? 'rgba(245,245,245,0.25)' : 'rgba(10,10,10,0.05)'),
                  fontFamily:    "'ABCWhyteInktrap', sans-serif",
                  fontSize:      16,
                  fontWeight:    700,
                  letterSpacing: '0.8px',
                  color:         langSheetOpen ? '#ffffff' : (isDark ? '#ffffff' : '#0a0a0a'),
                  whiteSpace:    'nowrap',
                }}
              >
                <GlobeIcon size={20} />
                {lang}
                <ChevronIcon size={12} open={langSheetOpen} />
              </button>

              {/* Close */}
              {(() => {
                const menuBg  = isDark ? 'rgba(245,245,245,0.25)' : 'rgba(10,10,10,0.05)'
                const menuClr = isDark ? '#ffffff' : '#0a0a0a'
                return (
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Fechar menu"
                    {...iconBtnHover(menuBg, menuClr)}
                    style={{
                      ...btnReset,
                      width:        48,
                      height:       48,
                      padding:      12,
                      borderRadius: '50%',
                      background:   menuBg,
                      color:        menuClr,
                    }}
                  >
                    <XIcon />
                  </button>
                )
              })()}
            </motion.div>

            {/* Links */}
            <nav
              style={{
                flex:           1,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'flex-end',
                justifyContent: 'center',
                gap:            40,
                padding:        '0 24px 80px',
                overflow:       'hidden',
              }}
            >
              {NAV_KEYS.map((link, i) => {
                const isActive = isHome && '#' + activeSection === link.href
                const color    = isActive ? '#EF3537' : isDark ? 'rgba(255,255,255,0.4)' : '#666666'
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 48 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 48, transition: {
                      delay:    (NAV_KEYS.length - 1 - i) * 0.035,
                      duration: 0.22,
                      ease:     [0.4, 0, 1, 1],
                    }}}
                    transition={{
                      delay:    0.22 + i * 0.055,
                      duration: 0.45,
                      ease:     [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => handleNav(link.href)}
                    style={{
                      ...btnReset,
                      justifyContent: 'flex-end',
                      width:          '100%',
                      fontFamily:     "'ABCWhyteInktrap', sans-serif",
                      fontSize:       20,
                      fontWeight:     700,
                      letterSpacing:  '1.2px',
                      lineHeight:     'normal',
                      color,
                      textAlign:      'right',
                    }}
                  >
                    {t(link.key)}
                  </motion.button>
                )
              })}
            </nav>

            {/* Language bottom sheet */}
            <AnimatePresence>
              {langSheetOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setLangSheetOpen(false)}
                    aria-hidden="true"
                    style={{
                      position:  'absolute',
                      inset:     0,
                      zIndex:    10,
                      background:'rgba(0,0,0,0.45)',
                    }}
                  />

                  {/* Sheet */}
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('nav.lang.title')}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 40, mass: 0.9 }}
                    style={{
                      position:      'absolute',
                      bottom:        0, left: 0, right: 0,
                      zIndex:        20,
                      borderRadius:  '24px 24px 0 0',
                      background:    '#1A1A1A',
                      paddingBottom: 'max(env(safe-area-inset-bottom), 32px)',
                    }}
                  >
                    {/* Drag handle */}
                    <div style={{
                      width:        36,
                      height:       4,
                      borderRadius: 2,
                      background:   'rgba(255,255,255,0.18)',
                      margin:       '14px auto 0',
                    }} />

                    {/* Label */}
                    <p style={{
                      fontFamily:    "'ABCWhyteInktrap', sans-serif",
                      fontSize:      11,
                      fontWeight:    700,
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      color:         '#666666',
                      padding:       '20px 24px 12px',
                      margin:        0,
                    }}>
                      {t('nav.lang.title')}
                    </p>

                    {/* Options */}
                    <ul
                      role="listbox"
                      aria-label={t('nav.lang.title')}
                      style={{ listStyle: 'none', margin: 0, padding: '0 16px 8px' }}
                    >
                      {LANGUAGES.map(({ code, label }) => {
                        const isActive = code === lang
                        return (
                          <li key={code} role="option" aria-selected={isActive}>
                            <button
                              onClick={() => { setLang(code); setLangSheetOpen(false); trackEvent('language_change', { language: code }) }}
                              style={{
                                ...btnReset,
                                width:          '100%',
                                justifyContent: 'space-between',
                                height:         56,
                                padding:        '0 12px',
                                borderRadius:   12,
                                background:     isActive ? 'rgba(239,53,55,0.12)' : 'transparent',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{
                                  fontFamily:    "'ABCWhyteInktrap', sans-serif",
                                  fontSize:      16,
                                  fontWeight:    700,
                                  letterSpacing: '0.5px',
                                  color:         isActive ? '#EF3537' : '#ffffff',
                                  minWidth:      36,
                                }}>
                                  {code}
                                </span>
                                <span style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize:   14,
                                  fontWeight: 400,
                                  color:      '#ffffff',
                                }}>
                                  {label}
                                </span>
                              </span>
                              {isActive && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                  stroke="#EF3537" strokeWidth="2.5"
                                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
