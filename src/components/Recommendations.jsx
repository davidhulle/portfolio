import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, animate, useMotionValue, AnimatePresence,
         useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'

/* ── Data ── */
const TESTIMONIALS_BASE = [
  { name: 'Paula Furlano',       avatar: '/images/recommendations/paula.jpg',          quoteKey: 'recs.0.quote',  fullQuoteKey: 'recs.0.full',  roleKey: 'recs.0.role'  },
  { name: 'Marina Truchi',       avatar: '/images/recommendations/marina.jpg',         quoteKey: 'recs.1.quote',  fullQuoteKey: 'recs.1.full',  roleKey: 'recs.1.role'  },
  { name: 'Lucía Santapaola',    avatar: '/images/recommendations/lucia.jpg',          quoteKey: 'recs.2.quote',  fullQuoteKey: 'recs.2.full',  roleKey: 'recs.2.role'  },
  { name: 'Lilianlize Yamasaki', avatar: '/images/recommendations/lilianlize.jpg',     quoteKey: 'recs.3.quote',  fullQuoteKey: 'recs.3.full',  roleKey: 'recs.3.role'  },
  { name: 'Natalia Bohdan',      avatar: '/images/recommendations/natalia.jpg',        quoteKey: 'recs.4.quote',  fullQuoteKey: 'recs.4.full',  roleKey: 'recs.4.role'  },
  { name: 'Bruno Gonçalves',     avatar: '/images/recommendations/bruno.jpg',          quoteKey: 'recs.5.quote',  fullQuoteKey: 'recs.5.full',  roleKey: 'recs.5.role'  },
  { name: 'Cláudia Casanova',    avatar: '/images/recommendations/claudia.jpg',        quoteKey: 'recs.6.quote',  fullQuoteKey: 'recs.6.full',  roleKey: 'recs.6.role'  },
  { name: 'Leonardo Duarte',     avatar: '/images/recommendations/leonardo.jpg',       quoteKey: 'recs.7.quote',  fullQuoteKey: 'recs.7.full',  roleKey: 'recs.7.role'  },
  { name: 'Laura Garzón',        avatar: '/images/recommendations/laura.jpg',          quoteKey: 'recs.8.quote',  fullQuoteKey: 'recs.8.full',  roleKey: 'recs.8.role'  },
  { name: 'Viviana Petraroia',   avatar: '/images/recommendations/viviana.jpg',        quoteKey: 'recs.9.quote',  fullQuoteKey: 'recs.9.full',  roleKey: 'recs.9.role'  },
  { name: 'Pamela Betancourt',   avatar: '/images/recommendations/pamela.jpg',         quoteKey: 'recs.10.quote', fullQuoteKey: 'recs.10.full', roleKey: 'recs.10.role' },
  { name: 'Carolina Castro',     avatar: '/images/recommendations/carolina.jpg',       quoteKey: 'recs.11.quote', fullQuoteKey: 'recs.11.full', roleKey: 'recs.11.role' },
  { name: 'Ernesto Lavandera',   avatar: '/images/recommendations/ernesto.jpg',        quoteKey: 'recs.12.quote', fullQuoteKey: 'recs.12.full', roleKey: 'recs.12.role' },
  { name: 'Rodrigo Esch',        avatar: '/images/recommendations/rodrigo.jpg',        quoteKey: 'recs.13.quote', fullQuoteKey: 'recs.13.full', roleKey: 'recs.13.role' },
  { name: 'Estefanía Gilges',    avatar: '/images/recommendations/estefania.jpg',      quoteKey: 'recs.14.quote', fullQuoteKey: 'recs.14.full', roleKey: 'recs.14.role' },
  { name: 'Vinicius Fernandes',  avatar: '/images/recommendations/vinicius.jpg',       quoteKey: 'recs.15.quote', fullQuoteKey: 'recs.15.full', roleKey: 'recs.15.role' },
  { name: 'Danielle Cruz',       avatar: '/images/recommendations/danielle.jpg',       quoteKey: 'recs.16.quote', fullQuoteKey: 'recs.16.full', roleKey: 'recs.16.role' },
  { name: 'Sofia Aldao',         avatar: '/images/recommendations/sofia.jpg',          quoteKey: 'recs.17.quote', fullQuoteKey: 'recs.17.full', roleKey: 'recs.17.role' },
  { name: 'Dario Iodice',        avatar: '/images/recommendations/dario.jpg',          quoteKey: 'recs.18.quote', fullQuoteKey: 'recs.18.full', roleKey: 'recs.18.role' },
  { name: 'Guilherme Zangarini', avatar: '/images/recommendations/guilherme.jpg',      quoteKey: 'recs.19.quote', fullQuoteKey: 'recs.19.full', roleKey: 'recs.19.role' },
  { name: 'Gabriela Pan',        avatar: '/images/recommendations/gabriela-pan.jpg',   quoteKey: 'recs.20.quote', fullQuoteKey: 'recs.20.full', roleKey: 'recs.20.role' },
  { name: 'Pedro Julien',        avatar: '/images/recommendations/pedro.jpg',          quoteKey: 'recs.21.quote', fullQuoteKey: 'recs.21.full', roleKey: 'recs.21.role' },
  { name: 'Rafaela Siqueira',    avatar: '/images/recommendations/rafaela.jpg',        quoteKey: 'recs.22.quote', fullQuoteKey: 'recs.22.full', roleKey: 'recs.22.role' },
  { name: 'Jéssica Ribeiro',     avatar: '/images/recommendations/jessica.jpg',        quoteKey: 'recs.23.quote', fullQuoteKey: 'recs.23.full', roleKey: 'recs.23.role' },
  { name: 'Natalí Dávila',       avatar: '/images/recommendations/natali.jpg',         quoteKey: 'recs.24.quote', fullQuoteKey: 'recs.24.full', roleKey: 'recs.24.role' },
  { name: 'Wesley Apolinário',   avatar: '/images/recommendations/wesley.jpg',         quoteKey: 'recs.25.quote', fullQuoteKey: 'recs.25.full', roleKey: 'recs.25.role' },
  { name: 'Gabriela Biscáro',    avatar: '/images/recommendations/gabriela-biscaro.jpg', quoteKey: 'recs.26.quote', fullQuoteKey: 'recs.26.full', roleKey: 'recs.26.role' },
  { name: 'Edu Gimenes',         avatar: '/images/recommendations/edu.jpg',            quoteKey: 'recs.27.quote', fullQuoteKey: 'recs.27.full', roleKey: 'recs.27.role' },
  { name: 'Lucas Sales',         avatar: '/images/recommendations/lucas.jpg',          quoteKey: 'recs.28.quote', fullQuoteKey: 'recs.28.full', roleKey: 'recs.28.role' },
  { name: 'Gabriel Pinheiro',    avatar: '/images/recommendations/gabriel.jpg',        quoteKey: 'recs.29.quote', fullQuoteKey: 'recs.29.full', roleKey: 'recs.29.role' },
]

const N            = TESTIMONIALS_BASE.length
const LINKEDIN_URL = 'https://www.linkedin.com/in/david-hulle/details/recommendations'

/* ── Desktop track geometry ── */
const CARD_H     = 304
const GAP        = 24
const STRIDE     = CARD_H + GAP
const CENTER_Y   = 296
const INIT_TRACK = N + 1
const INIT_Y     = CENTER_Y - INIT_TRACK * STRIDE

/* ── Tablet peek carousel ── */
const TAB_CARD_W = 586
const TAB_GAP    = 24

/* ── Mobile/Tablet x-offset helpers ── */
function calcTabX(pos, w) {
  return (w - 16) / 2 - pos * (TAB_CARD_W + TAB_GAP) - TAB_CARD_W / 2
}
function calcMobX(pos, w) {
  const cardW = w - 80
  return (w - 16) / 2 - pos * (cardW + 16) - cardW / 2
}

/* ── Mobile carousel variants ── */
const mobileVariants = {
  enter:  dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center:          { x: 0, opacity: 1 },
  exit:   dir => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}
const mobileSpring = { type: 'spring', stiffness: 300, damping: 60, mass: 1 }

/* ── Shared icons ── */
function ArrowUpRight({ color = '#FCDADA' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}>
      <path d="M4 12L12 4M12 4H5M12 4V11" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1280)
  useEffect(() => {
    const fn = () => setOk(window.innerWidth >= 1280)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return ok
}

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

function useWindowHeight() {
  const [h, setH] = useState(() => typeof window !== 'undefined' ? window.innerHeight : 896)
  useEffect(() => {
    const fn = () => setH(window.innerHeight)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return h
}

/* ─────────────────────────────────────────
   Desktop Modal
───────────────────────────────────────── */
function DesktopModal({ t, onClose }) {
  const { t: tr } = useLang()
  return createPortal(
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 60 }}
          style={{
            position:      'relative',
            width:         '100%',
            maxWidth:      '720px',
            maxHeight:     'calc(100vh - 96px)',
            background:    '#110008',
            borderRadius:  '24px',
            boxSizing:     'border-box',
            border:        '1px solid rgba(255,255,255,0.08)',
            boxShadow:     '0 32px 80px rgba(0,0,0,0.6)',
            display:       'flex',
            flexDirection: 'column',
            overflow:      'hidden',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={tr('recs.close')}
            style={{
              position:   'absolute',
              top:        '20px',
              right:      '20px',
              width:      '36px',
              height:     '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border:     'none',
              cursor:     'pointer',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:      'rgba(255,255,255,0.6)',
              transition: 'background 0.2s',
              zIndex:     1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <CloseIcon />
          </button>

          {/* Quote — scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '48px 48px 0', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '20px',
              fontWeight: 400,
              lineHeight: '1.55',
              color:      '#FFFFFF',
              margin:     0,
              whiteSpace: 'pre-wrap',
              paddingRight: '16px',
            }}>
              {t.fullQuote}
            </p>
          </div>

          {/* Author — always visible */}
          <div style={{ flexShrink: 0, padding: '0 48px 48px' }}>
            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '32px 0' }} />

            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={t.avatar} alt={t.name}
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 'normal' }}>
                {t.name}
              </p>
              <p style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', margin: '4px 0 0', lineHeight: 'normal' }}>
                {t.role}
              </p>
            </div>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                padding:        '10px 20px',
                background:     'rgba(255,255,255,0.08)',
                borderRadius:   '100px',
                textDecoration: 'none',
                fontFamily:     "'Inter', sans-serif",
                fontSize:       '14px',
                fontWeight:     500,
                color:          '#FFFFFF',
                whiteSpace:     'nowrap',
                border:         '1px solid rgba(255,255,255,0.12)',
                transition:     'background 0.2s',
                flexShrink:     0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              {tr('recs.linkedin')}
              <ArrowUpRight color="rgba(255,255,255,0.7)" />
            </a>
          </div>
          </div>{/* /author wrapper */}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

/* ─────────────────────────────────────────
   Mobile Bottom Sheet
───────────────────────────────────────── */
function MobileBottomSheet({ t, onClose }) {
  const contentRef    = useRef(null)
  const { t: tr }     = useLang()

  return createPortal(
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9000 }}>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        />

        {/* Sheet */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.25 }}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.y > 120 || velocity.y > 600) onClose()
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 65 }}
          style={{
            position:      'absolute',
            bottom:        0,
            left:          0,
            right:         0,
            background:    '#110008',
            borderRadius:  '24px 24px 0 0',
            maxHeight:     '82vh',
            display:       'flex',
            flexDirection: 'column',
            boxShadow:     '0 -16px 60px rgba(0,0,0,0.5)',
            overflow:      'hidden',
            touchAction:   'none',
          }}
        >
          {/* Handle + header (draggable area) */}
          <div style={{ padding: '12px 24px 0', flexShrink: 0, cursor: 'grab' }}>
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />

            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={t.avatar} alt={t.name}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 'normal' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.55)', margin: '3px 0 0', lineHeight: 'normal' }}>
                  {t.role}
                </p>
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label={tr('recs.close')}
                style={{
                  width:      '36px',
                  height:     '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border:     'none',
                  cursor:     'pointer',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color:      'rgba(255,255,255,0.6)',
                  flexShrink: 0,
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            ref={contentRef}
            style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px', touchAction: 'pan-y' }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '18px',
              fontWeight: 400,
              lineHeight: '1.6',
              color:      '#FFFFFF',
              margin:     0,
              whiteSpace: 'pre-wrap',
            }}>
              {t.fullQuote}
            </p>

            {/* LinkedIn link */}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '6px',
                marginTop:      '32px',
                padding:        '12px 24px',
                background:     'rgba(255,255,255,0.08)',
                borderRadius:   '100px',
                textDecoration: 'none',
                fontFamily:     "'Inter', sans-serif",
                fontSize:       '15px',
                fontWeight:     500,
                color:          '#FFFFFF',
                border:         '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {tr('recs.linkedin')}
              <ArrowUpRight color="rgba(255,255,255,0.7)" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

/* ─────────────────────────────────────────
   Cards
───────────────────────────────────────── */
function DesktopCard({ t, active, onReadMore }) {
  const { t: tr } = useLang()
  return (
    <div style={{
      height:               `${CARD_H}px`,
      borderRadius:         '40px',
      padding:              '40px',
      background:           'rgba(107, 0, 14, 0.50)',
      backdropFilter:       'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border:               '1px solid rgba(255, 255, 255, 0.10)',
      opacity:              active ? 1 : 0.4,
      position:             'relative',
      boxSizing:            'border-box',
      flexShrink:           0,
      transition:           'opacity 0.65s ease',
    }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', fontWeight: 400, lineHeight: 'normal', color: '#FFFFFF', margin: 0, maxHeight: '120px', overflow: 'hidden' }}>
        {t.quote}
      </p>
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 'normal' }}>
            {t.name}
          </p>
          <p style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '16px', fontWeight: 400, color: '#FFFFFF', margin: 0, lineHeight: 'normal' }}>
            {t.role}
          </p>
        </div>
        <button
          onClick={() => onReadMore(t)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <span style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '16px', color: '#FCDADA', whiteSpace: 'nowrap' }}>{tr('recs.read_more')}</span>
          <ArrowUpRight />
        </button>
      </div>
    </div>
  )
}

function MobileCard({ t, onReadMore }) {
  const { t: tr }        = useLang()
  const [ctaHover, setCtaHover] = useState(false)
  return (
    <div style={{ background: 'rgba(107, 0, 14, 0.50)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '40px', padding: '24px', minHeight: '360px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 400, lineHeight: '22px', letterSpacing: '0.28px', color: '#FFFFFF', margin: 0 }}>
          {t.quote}
        </p>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: '16px', fontWeight: 500, letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
              {t.name}
            </p>
            <p style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '12px', fontWeight: 400, letterSpacing: '0.24px', color: '#FFFFFF', margin: '4px 0 0' }}>
              {t.role}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <button
            onClick={() => onReadMore(t)}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "'ABCWhyte', sans-serif", fontSize: '16px', color: '#FCDADA' }}>{tr('recs.read_more')}</span>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: ctaHover ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '1px', background: '#FCDADA' }}
              />
            </div>
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Dot pager — max 9 dots, edge dots smaller
───────────────────────────────────────── */
const DOT_SIZES    = [8, 6, 5, 4, 3]  // index = distance from active
const DOT_OPACS    = [1, 0.5, 0.4, 0.3, 0.2]
const MAX_DOTS     = 9
const HALF_WIN     = Math.floor(MAX_DOTS / 2)

function DotPager({ active, total, vertical, onGoto }) {
  const count = Math.min(total, MAX_DOTS)
  const start = Math.min(Math.max(active - HALF_WIN, 0), Math.max(total - count, 0))
  return (
    <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: '8px' }}>
      {Array.from({ length: count }, (_, i) => {
        const idx  = start + i
        const dist = Math.min(Math.abs(idx - active), DOT_SIZES.length - 1)
        const sz   = DOT_SIZES[dist]
        return (
          <button
            key={idx}
            onClick={() => onGoto(idx)}
            style={{
              width: sz, height: sz,
              borderRadius: '50%',
              background: '#ffffff',
              opacity: DOT_OPACS[dist],
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              transition: 'width 0.25s ease, height 0.25s ease, opacity 0.25s ease',
            }}
          />
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function Recommendations() {
  const [ref, inView]                 = useInView({ threshold: 0.1 })
  const [activeIndex, setActiveIndex] = useState(1)
  const [direction,   setDirection]   = useState(1)
  const [paused,      setPaused]      = useState(false)
  const [selected,    setSelected]    = useState(null)
  const { t }        = useLang()
  const TESTIMONIALS = TESTIMONIALS_BASE.map(tb => ({ ...tb, quote: t(tb.quoteKey), fullQuote: t(tb.fullQuoteKey), role: t(tb.roleKey) }))
  const EXTENDED     = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
  const isDesktop    = useIsDesktop()
  const winW        = useWindowWidth()
  const winH        = useWindowHeight()
  const isTablet    = !isDesktop && winW >= 1024
  const mobCardW    = winW - 80
  const trackPos    = useRef(INIT_TRACK)
  const touchStartX = useRef(null)
  const centYRef    = useRef(CENTER_Y)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], [60, -120])
  const iY   = useSpring(rawY, { stiffness: 40, damping: 15 })
  const yMV  = useMotionValue(INIT_Y)
  const xMV  = useMotionValue(0)  // set on first effect
  const winWRef = useRef(winW)

  /* Keep winWRef in sync */
  useEffect(() => { winWRef.current = winW }, [winW])

  /* Re-center track when viewport height changes */
  useEffect(() => {
    const cy = Math.round(winH / 2 - CARD_H / 2)
    centYRef.current = cy
    yMV.set(cy - trackPos.current * STRIDE)
  }, [winH, yMV])

  /* Re-sync xMV when viewport width changes (card size changes) */
  useEffect(() => {
    const w = winWRef.current
    const x = w >= 1024 && w < 1280
      ? calcTabX(trackPos.current, w)
      : calcMobX(trackPos.current, w)
    xMV.set(x)
  }, [winW, xMV])

  /* Lock body scroll while overlay is open */
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  /* Close on ESC */
  useEffect(() => {
    if (!selected) return
    const onKey = e => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  /* Pause autoplay while overlay is open */
  const openOverlay = useCallback(t => {
    setSelected(t)
    setPaused(true)
  }, [])
  const closeOverlay = useCallback(() => {
    setSelected(null)
    setPaused(false)
  }, [])

  /* Vertical track animation + horizontal mobile track animation */
  const animateTo = useCallback((targetPos) => {
    const cy  = centYRef.current
    const w   = winWRef.current
    const getX = (pos) => w >= 1024 && w < 1280 ? calcTabX(pos, w) : calcMobX(pos, w)

    animate(yMV, cy - targetPos * STRIDE, {
      type: 'spring', stiffness: 260, damping: 58, mass: 1,
      onComplete: () => {
        if (trackPos.current !== targetPos) return
        if (targetPos >= 2 * N) {
          const s = targetPos - N
          const ww = winWRef.current
          yMV.set(cy - s * STRIDE)
          xMV.set(ww >= 1024 && ww < 1280 ? calcTabX(s, ww) : calcMobX(s, ww))
          trackPos.current = s
        } else if (targetPos < N) {
          const s = targetPos + N
          const ww = winWRef.current
          yMV.set(cy - s * STRIDE)
          xMV.set(ww >= 1024 && ww < 1280 ? calcTabX(s, ww) : calcMobX(s, ww))
          trackPos.current = s
        }
      },
    })

    if (w < 1280) {
      animate(xMV, getX(targetPos), { type: 'spring', stiffness: 300, damping: 60, mass: 1 })
    }
  }, [yMV, xMV])

  const prev = useCallback(() => {
    setDirection(-1); setActiveIndex(i => (i - 1 + N) % N)
    const p = trackPos.current - 1; trackPos.current = p; animateTo(p)
  }, [animateTo])

  const next = useCallback(() => {
    setDirection(1); setActiveIndex(i => (i + 1) % N)
    const p = trackPos.current + 1; trackPos.current = p; animateTo(p)
  }, [animateTo])

  const gotoSlide = useCallback((i) => {
    if (i === activeIndex) return
    const steps = ((i - activeIndex + N) % N)
    const delta = steps <= N / 2 ? steps : steps - N
    const p = trackPos.current + delta
    trackPos.current = p; setDirection(delta > 0 ? 1 : -1); setActiveIndex(i); animateTo(p)
  }, [activeIndex, animateTo])

  useEffect(() => {
    if (!inView || paused) return
    const id = setInterval(next, 3500)
    return () => clearInterval(id)
  }, [inView, paused, next])

  const handleTouchStart = useCallback(e => {
    touchStartX.current = e.touches[0].clientX; setPaused(true)
  }, [])
  const handleTouchEnd = useCallback(e => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
    setTimeout(() => setPaused(false), 1500)
  }, [next, prev])

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <>
        <section id="recomendacoes" ref={ref} style={{ overflow: 'hidden', padding: '16px', background: 'var(--bg-white)', height: '100svh' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', background: '#9E0015', backgroundImage: "url('/images/degrade.png')", backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '40px', overflow: 'hidden', height: '100%', display: 'flex' }}
          >
            <motion.img src="/images/balao.svg" alt="" aria-hidden="true"
              style={{ position: 'absolute', left: '-32px', top: '-26px', width: '711px', height: '540px', pointerEvents: 'none', userSelect: 'none', zIndex: 1, y: iY }} />

            {/* Left content */}
            <div style={{ flex: '1 1 50%', minWidth: 0, padding: `clamp(80px, 14vw, 229px) 40px 96px ${winW >= 1440 ? '8vw' : 'clamp(32px, 9vw, 140px)'}`, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: winW >= 1680 ? 3 : 2 }}>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Network', sans-serif", fontSize: 'clamp(56px, 7.5vw, 128px)', fontWeight: 400, lineHeight: 0.86, color: '#FFFFFF', margin: 0, maxWidth: '776px' }}>
                {t('recs.heading')}
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(16px, 1.6vw, 24px)', fontWeight: 300, lineHeight: '1.4', color: '#FFFFFF', marginTop: '24px', maxWidth: '623px' }}>
                {t('recs.desc')}
              </motion.p>
            </div>

            {/* Right: track + pager */}
            <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
              style={{ flex: '0 0 45%', marginLeft: winW >= 1680 ? '-120px' : 0, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'stretch' }}>
              <div style={{ flex: 1, height: '100%', overflow: 'hidden', paddingRight: winW >= 1440 ? 'calc(8vw + 48px)' : '72px', maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                <motion.div style={{ y: yMV }}>
                  {EXTENDED.map((t, i) => (
                    <div key={i} style={{ marginBottom: i < EXTENDED.length - 1 ? `${GAP}px` : 0 }}>
                      <DesktopCard t={t} active={i % N === activeIndex} onReadMore={openOverlay} />
                    </div>
                  ))}
                </motion.div>
              </div>
              {/* Pager */}
              <div style={{ position: 'absolute', right: winW >= 1440 ? '8vw' : '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button onClick={prev} aria-label={t('recs.prev')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 9L8 2L15 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <DotPager active={activeIndex} total={N} vertical={true} onGoto={gotoSlide} />
                <button onClick={next} aria-label={t('recs.next')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modal — rendered in document.body via portal */}
        {selected && <DesktopModal t={selected} onClose={closeOverlay} />}
      </>
    )
  }

  /* ── MOBILE ── */
  return (
    <>
      <section id="recomendacoes" ref={ref} style={{ overflow: 'hidden', padding: '8px 8px', background: 'var(--bg-white)', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', background: '#9E0015', backgroundImage: "url('/images/degrade.png')", backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '50px', overflow: 'hidden', flex: 1 }}
        >
          <motion.img src="/images/balao.svg" alt="" aria-hidden="true"
            style={{ position: 'absolute', left: '97px', top: '-9px', width: '328px', height: '249px', pointerEvents: 'none', userSelect: 'none', zIndex: 1, y: iY }} />

          {/* Text content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '140px 24px 0' }}>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Network', sans-serif", fontSize: '56px', fontWeight: 400, lineHeight: '57px', color: '#FFFFFF', margin: 0 }}>
              {t('recs.heading')}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 300, lineHeight: '1.23', color: '#FFFFFF', marginTop: '32px', maxWidth: '366px' }}>
              {t('recs.desc')}
            </motion.p>
          </div>

          {/* Carousel */}
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ position: 'relative', zIndex: 2, marginTop: '64px', overflow: 'hidden' }}>
            {isTablet ? (
              /* ── Peek carousel (1024–1279px) — infinite loop via EXTENDED ── */
              <motion.div style={{ display: 'flex', gap: `${TAB_GAP}px`, x: xMV }}>
                {EXTENDED.map((t, i) => (
                  <motion.div
                    key={i}
                    style={{ flex: `0 0 ${TAB_CARD_W}px` }}
                    animate={{ opacity: i % N === activeIndex ? 1 : 0.4 }}
                    transition={{ duration: 0.45 }}
                  >
                    <MobileCard t={t} onReadMore={openOverlay} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* ── Peek carousel (< 1024px) — infinite loop via EXTENDED ── */
              <motion.div style={{ display: 'flex', alignItems: 'stretch', gap: '16px', x: xMV }}>
                {EXTENDED.map((t, i) => (
                  <motion.div
                    key={i}
                    style={{ flex: `0 0 ${mobCardW}px`, display: 'flex', flexDirection: 'column' }}
                    animate={{ opacity: i % N === activeIndex ? 1 : 0.4 }}
                    transition={{ duration: 0.45 }}
                  >
                    <MobileCard t={t} onReadMore={openOverlay} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 40px' }}>
            <DotPager active={activeIndex} total={N} vertical={false} onGoto={gotoSlide} />
          </div>
        </motion.div>
      </section>

      {/* Bottom sheet — rendered in document.body via portal */}
      {selected && <MobileBottomSheet t={selected} onClose={closeOverlay} />}
    </>
  )
}
