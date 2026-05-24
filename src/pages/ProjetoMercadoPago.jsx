import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'
import Navbar  from '../components/Navbar'
import Contact from '../components/Contact'

/* ── Local assets ── */
const IMG = {
  heroBg:        '/images/projects/mercadopago/hero-bg.jpg',
  heroBgDesktop: '/images/projects/mercadopago/hero-bg-desktop.png',
  heroBgMobile:  '/images/projects/mercadopago/hero-bg-mobile.png',
  iphone:        '/images/projects/mercadopago/iphone-frame.png',
  screenHero:    '/images/projects/mercadopago/screen-hero.jpg',
  screenS01:     '/images/projects/mercadopago/screen-s01.jpg',
  oldUi:         '/images/projects/mercadopago/old-ui.jpg',
  gantt:         '/images/projects/mercadopago/strategy-gantt-desktop.jpg',
  ganttMobile:   '/images/projects/mercadopago/strategy-gantt-mobile.jpg',
  darkBg:        '/images/projects/mercadopago/dark-bg.jpg',
  screenResults:   '/images/projects/mercadopago/screen-results.jpg',
  imgResultados:   '/images/projects/mercadopago/img-resultados.png',
  telasDesktop:    '/images/projects/mercadopago/img-telas-desktop.png',
  telasMobile:     '/images/projects/mercadopago/img-telas-mobile.png',
  gallery: [
    '/images/projects/mercadopago/screen-g01.jpg',
    '/images/projects/mercadopago/screen-g02.jpg',
    '/images/projects/mercadopago/screen-g03.jpg',
    '/images/projects/mercadopago/screen-g04.jpg',
    '/images/projects/mercadopago/screen-g05.jpg',
    '/images/projects/mercadopago/screen-g06.jpg',
    '/images/projects/mercadopago/screen-g07.jpg',
  ],
}

/* ── Responsive hook ── */
function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const fn = () => setOk(window.innerWidth >= 1024)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return ok
}

/* ── iPhone frame component ── */
function PhoneFrame({ src, alt = '', width = 320, style = {} }) {
  const height = Math.round(width * (815.9 / 398))
  return (
    <div style={{ position: 'relative', width, height, flexShrink: 0, ...style }}>
      {src && (
        <img
          src={src}
          alt={alt}
          style={{
            position:     'absolute',
            top:          '1.8%',
            left:         '4.4%',
            width:        '91.2%',
            height:       '96.4%',
            objectFit:    'cover',
            borderRadius: '8%',
          }}
        />
      )}
      <img
        src={IMG.iphone}
        alt=""
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          objectFit:     'contain',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* ── Shared typography styles — dark-mode aware ── */
const T = {
  sectionTitle: (isDesktop, isDark) => ({
    fontFamily: "'ABCWhyteInktrap', sans-serif",
    fontWeight: 700,
    fontSize:   isDesktop ? '64px' : '40px',
    lineHeight: isDesktop ? '0.83' : 'normal',
    color:      isDark ? '#F5F2EE' : '#0A0A0A',
    margin:     0,
  }),
  body: (isDesktop, isDark) => ({
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize:   isDesktop ? '20px' : '16px',
    lineHeight: 1.45,
    color:      isDark ? 'rgba(245,242,238,0.7)' : 'rgba(0,0,0,0.7)',
    margin:     0,
  }),
  boldInline: (isDark) => ({
    fontWeight: 700,
    color:      isDark ? 'rgba(245,242,238,0.85)' : 'rgba(0,0,0,0.7)',
  }),
}

/* ══════════════ SECTIONS ══════════════ */

/* ── HERO ── */
function HeroSection({ isDesktop, isDark }) {
  const pad = isDesktop ? 16 : 8
  return (
    <section
      aria-label="Hero"
      style={{
        height:     '100svh',
        minHeight:  '600px',
        padding:    `${pad}px`,
        background: isDark ? '#0A0A0A' : '#ffffff',
        position:   'relative',
      }}
    >
      <div
        style={{
          width:              '100%',
          height:             '100%',
          borderRadius:       isDesktop ? 40 : 32,
          overflow:           'hidden',
          backgroundImage:    `url(${isDesktop ? IMG.heroBgDesktop : IMG.heroBgMobile})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center top',
        }}
      />
    </section>
  )
}

/* ── SECTION 01 — Intro ── */
function IntroSection({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const pad = isDesktop ? '162px' : '24px'

  return (
    <section
      ref={ref}
      style={{
        padding:       isDesktop ? `120px ${pad}` : `80px ${pad} 32px`,
        display:       'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        alignItems:    isDesktop ? 'center' : 'flex-start',
        gap:           isDesktop ? '80px' : '64px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isDesktop ? '96px' : '40px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{
            fontFamily: "'ABCWhyteInktrap', sans-serif",
            fontSize:   isDesktop ? '24px' : '14px',
            lineHeight: 0.96,
            color:      isDark ? 'rgba(245,242,238,0.5)' : 'rgba(10,10,10,0.5)',
            margin:     0,
            fontWeight: 300,
          }}>
            {t('project.mp.client')}
          </p>
          <p style={{
            fontFamily: "'Network', cursive",
            fontSize:   isDesktop ? '96px' : '64px',
            lineHeight: 0.72,
            color:      isDark ? '#F5F2EE' : '#0A0A0A',
            margin:     0,
          }}>
            {t('project.mp.title.line1')}<br />
            {t('project.mp.title.line2')}
          </p>
        </div>

        <p style={{
          ...T.body(isDesktop, isDark),
          color:    isDark ? 'rgba(245,242,238,0.8)' : 'rgba(0,0,0,0.8)',
          maxWidth: isDesktop ? 782 : '100%',
        }}>
          {t('project.mp.intro.start')}
          <strong style={{ fontWeight: 900 }}>{t('project.mp.intro.bold')}</strong>
          {t('project.mp.intro.end')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: isDesktop ? 1 : undefined, alignSelf: isDesktop ? 'auto' : 'center', display: 'flex', justifyContent: 'center' }}
      >
        {/* PhoneFrame com vídeo interno + moldura por cima */}
        {(() => {
          const w = 320
          const h = Math.round(w * (815.9 / 398))
          return (
            <div style={{ position: 'relative', width: w, height: h, flexShrink: 0 }}>
              <video
                autoPlay loop muted playsInline
                style={{
                  position:     'absolute',
                  top:          '1.8%',
                  left:         '4.4%',
                  width:        '91.2%',
                  height:       '96.4%',
                  objectFit:    'cover',
                  borderRadius: '8%',
                  display:      'block',
                }}
              >
                <source src="/videos/lp-meli-video-mobile.mp4" type="video/mp4" />
                <img src={IMG.screenS01} alt="Tela do app Mercado Pago" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </video>
              <img
                src={IMG.iphone}
                alt=""
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
              />
            </div>
          )
        })()}
      </motion.div>
    </section>
  )
}

/* ── SECTION 02 — Problem ── */
function ProblemSection({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const pad = isDesktop ? '162px' : '24px'

  const paragraphs = [
    {
      bold:  t('project.mp.s02.p1.bold'),
      parts: [
        t('project.mp.s02.p1.text1'),
        <strong key="b" style={{ fontWeight: 600 }}>{t('project.mp.s02.p1.bold2')}</strong>,
        t('project.mp.s02.p1.text2'),
      ],
    },
    {
      bold:  t('project.mp.s02.p2.bold'),
      parts: [
        t('project.mp.s02.p2.text1'),
        <strong key="b" style={{ fontWeight: 600 }}>{t('project.mp.s02.p2.bold2')}</strong>,
        t('project.mp.s02.p2.text2'),
      ],
    },
    { bold: t('project.mp.s02.p3.bold'), parts: [t('project.mp.s02.p3.text')] },
    { bold: t('project.mp.s02.p4.bold'), parts: [t('project.mp.s02.p4.text')] },
  ]

  return (
    <section
      ref={ref}
      style={{
        padding:       isDesktop ? '0' : `80px ${pad}`,
        paddingBottom: isDesktop ? '80px' : undefined,
        display:       'flex',
        flexDirection: isDesktop ? 'row' : 'column-reverse',
        gap:           isDesktop ? '80px' : '64px',
        alignItems:    'flex-start',
        position:      'relative',
        minHeight:     isDesktop ? '80vh' : undefined,
      }}
    >
      {/* Left — Old UI screenshot */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flexShrink:  0,
          width:       isDesktop ? 'calc(50% - 40px)' : '100%',
          paddingLeft: isDesktop ? pad : undefined,
          paddingTop:  isDesktop ? '32px' : undefined,
        }}
      >
        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontWeight:    500,
          fontSize:      isDesktop ? '20px' : '16px',
          color:         isDark ? '#555' : '#B2B2B2',
          textAlign:     'right',
          letterSpacing: '-0.05em',
          margin:        '0 0 8px',
        }}>
          {t('project.mp.s02.oldui')}
        </p>
        <div style={{
          width:        '100%',
          maxHeight:    isDesktop ? '70vh' : '55vh',
          overflow:     'hidden',
          borderRadius: 13,
          boxShadow:    isDark
            ? '0 0 40px rgba(0,0,0,0.5)'
            : '0 0 40px rgba(0,0,0,0.1)',
        }}>
          <img
            src={IMG.oldUi}
            alt={`${t('project.mp.s02.oldui')} - Mercado Pago`}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </motion.div>

      {/* Right — sticky text */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          gap:           48,
          paddingRight:  isDesktop ? pad : undefined,
          paddingTop:    isDesktop ? '128px' : undefined,
          position:      isDesktop ? 'sticky' : 'static',
          top:           isDesktop ? '120px' : undefined,
          alignSelf:     isDesktop ? 'flex-start' : undefined,
        }}
      >
        <h2 style={T.sectionTitle(isDesktop, isDark)}>
          {t('project.mp.s02.title1')}<br />
          {t('project.mp.s02.title2')}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ ...T.body(isDesktop, isDark), margin: 0 }}>
              <strong style={T.boldInline(isDark)}>{p.bold}</strong>
              {p.parts}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ── SECTION 03 — Strategy Part 1 ── */
function StrategySection1({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const pad = isDesktop ? '162px' : '24px'

  return (
    <section ref={ref}>
      <div
        style={{
          padding:       isDesktop ? `160px ${pad} 80px` : `80px ${pad} 64px`,
          display:       'flex',
          flexDirection: 'column',
          gap:           isDesktop ? 80 : 48,
          alignItems:    'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 1271, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'center' }}
        >
          <h2 style={{ ...T.sectionTitle(isDesktop, isDark), textAlign: isDesktop ? 'center' : 'left', lineHeight: 0.83 }}>
            {t('project.mp.s03.title')}
          </h2>

          <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: 48, width: '100%' }}>
            <p style={{ ...T.body(isDesktop, isDark), flex: 1 }}>
              <strong style={T.boldInline(isDark)}>{t('project.mp.s03.p1.bold')}</strong>
              {t('project.mp.s03.p1.text')}
            </p>
            <p style={{ ...T.body(isDesktop, isDark), flex: 1, whiteSpace: 'pre-line' }}>
              <strong style={T.boldInline(isDark)}>{t('project.mp.s03.p2.bold')}</strong>
              {t('project.mp.s03.p2.text')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', borderRadius: isDesktop ? 40 : 10, overflow: 'hidden' }}
        >
          <img
            src={isDesktop ? IMG.gantt : IMG.ganttMobile}
            alt="Roadmap estratégico do projeto"
            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
          />
        </motion.div>
      </div>

      {/* Dark quote band — always dark background, no theme change needed */}
      <div
        id="mp-quote"
        style={{
          position:       'relative',
          overflow:       'hidden',
          height:         '100svh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        isDesktop ? '80px 162px' : '64px 24px',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <img src={IMG.darkBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:   'relative',
            fontFamily: "'ABCWhyteInktrap', sans-serif",
            fontWeight: 700,
            fontSize:   isDesktop ? '64px' : '32px',
            lineHeight: 'normal',
            color:      '#F5F2EE',
            textAlign:  'center',
            maxWidth:   884,
            margin:     0,
          }}
        >
          {t('project.mp.s03.quote')}
        </motion.p>
      </div>
    </section>
  )
}

/* ── SECTION 04 — Strategy Part 2 ── */
function StrategySection2({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const pad = isDesktop ? '162px' : '24px'
  const placeholderBg = isDark ? '#1E1E1E' : '#D4D4D4'

  return (
    <section
      ref={ref}
      style={{
        padding:       isDesktop ? '120px 0' : `80px ${pad}`,
        display:       'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        gap:           isDesktop ? '80px' : '64px',
        alignItems:    isDesktop ? 'center' : 'flex-start',
        minHeight:     isDesktop ? '80vh' : undefined,
      }}
    >
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flexShrink:          0,
            width:               '48%',
            paddingLeft:         pad,
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows:    '240px 280px',
            gap:                 12,
          }}
        >
          {/* meli01 — top-left */}
          <div style={{ borderRadius: 32, overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
              <source src="/videos/motion-meli01.mp4" type="video/mp4" />
            </video>
          </div>
          {/* meli03 — right, tall (spans 2 rows) */}
          <div style={{ gridRow: '1 / 3', gridColumn: '2 / 3', borderRadius: 32, overflow: 'hidden', background: placeholderBg }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
              <source src="/videos/motion-meli03.mp4" type="video/mp4" />
            </video>
          </div>
          {/* meli02 — bottom-left */}
          <div style={{ borderRadius: 32, overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
              <source src="/videos/motion-meli02.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      )}

      {!isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}
        >
          {/* meli01 — top-left */}
          <div style={{ height: 180, borderRadius: 20, overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
              <source src="/videos/motion-meli01.mp4" type="video/mp4" />
            </video>
          </div>
          {/* meli03 — right, tall */}
          <div style={{ height: 300, borderRadius: 20, overflow: 'hidden', background: placeholderBg, gridRow: '1 / 3', gridColumn: '2 / 3' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
              <source src="/videos/motion-meli03.mp4" type="video/mp4" />
            </video>
          </div>
          {/* meli02 — bottom-left */}
          <div style={{ height: 112, borderRadius: 20, overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
              <source src="/videos/motion-meli02.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          gap:           48,
          paddingRight:  isDesktop ? pad : undefined,
        }}
      >
        <h2 style={T.sectionTitle(isDesktop, isDark)}>
          {t('project.mp.s04.title1')}<br />
          {t('project.mp.s04.title2')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ ...T.body(isDesktop, isDark), margin: 0 }}>
            <strong style={T.boldInline(isDark)}>{t('project.mp.s04.p1.bold')}</strong>
            {t('project.mp.s04.p1.text')}
          </p>
          <p style={{ ...T.body(isDesktop, isDark), margin: 0 }}>
            <strong style={T.boldInline(isDark)}>{t('project.mp.s04.p2.bold')}</strong>
            {t('project.mp.s04.p2.text')}
          </p>
        </div>
      </motion.div>
    </section>
  )
}

/* ── SECTION 05 — Video placeholder ── */
function VideoSection({ isDesktop, isDark }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const pad = isDesktop ? '162px' : '24px'

  return (
    <section ref={ref} style={{ padding: isDesktop ? `40px ${pad}` : '40px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:   isDark ? '#141414' : '#F4F4F4',
          borderRadius: isDesktop ? 40 : 0,
          overflow:     'hidden',
        }}
      >
        <video
          autoPlay loop muted playsInline
          style={{
            width: '100%',
            display:    'block',
          }}
        >
          <source src="/videos/lp-meli-video-desktop.mp4" type="video/mp4" />
        </video>
      </motion.div>
    </section>
  )
}

/* ── SECTION 06 — Telas full-width ── */
function TelasSection({ isDesktop }) {
  const [ref, inView] = useInView({ threshold: 0.05 })

  return (
    <section ref={ref} style={{ margin: 0, padding: 0, lineHeight: 0 }}>
      <motion.img
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        src={isDesktop ? IMG.telasDesktop : IMG.telasMobile}
        alt="Telas do redesign Mercado Pago"
        style={{
          width:      isDesktop ? '100%' : '100vw',
          marginLeft: isDesktop ? 0 : 'calc(50% - 50vw)',
          display:    'block',
        }}
      />
    </section>
  )
}

/* ── SECTION 07 — Results (Business Impact) ── */
function ResultsBusinessSection({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.1 })

  const kpis = [
    {
      value: t('project.mp.s07.kpi1.value'),
      line1: t('project.mp.s07.kpi1.line1'),
      line2: t('project.mp.s07.kpi1.line2'),
    },
    {
      value: t('project.mp.s07.kpi2.value'),
      line1: t('project.mp.s07.kpi2.line1'),
      line2: <>{t('project.mp.s07.kpi2.mx')}<strong>{t('project.mp.s07.kpi2.bold')}</strong>{t('project.mp.s07.kpi2.br')}</>,
    },
    {
      value: t('project.mp.s07.kpi3.value'),
      line1: t('project.mp.s07.kpi3.line1'),
      line2: <>{t('project.mp.s07.kpi3.mx')}<strong>{t('project.mp.s07.kpi3.bold')}</strong>{t('project.mp.s07.kpi3.br')}</>,
    },
    {
      value: t('project.mp.s07.kpi4.value'),
      line1: isDesktop ? t('project.mp.s07.kpi4.line1') : t('project.mp.s07.kpi4.label'),
      line2: isDesktop ? t('project.mp.s07.kpi4.line2') : undefined,
    },
  ]

  return (
    <section
      ref={ref}
      style={{
        paddingTop:    isDesktop ? '120px' : '80px',
        paddingBottom: isDesktop ? '80px' : '0',
        paddingLeft:   isDesktop ? '324px' : '24px',
        paddingRight:  isDesktop ? 0 : '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 48 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={T.sectionTitle(isDesktop, isDark)}>
            {t('project.mp.s07.title')}
          </h2>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    500,
            fontSize:      isDesktop ? '24px' : '20px',
            color:         isDark ? '#777' : '#666666',
            letterSpacing: '-0.05em',
            margin:        0,
          }}>
            {t('project.mp.s07.subtitle')}
          </p>
        </div>

        <div style={{
          display:    'flex',
          flexWrap:   'wrap',
          gap:        isDesktop ? '40px' : '24px',
          flexDirection: isDesktop ? 'column' : 'row',
        }}>
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display:       'flex',
                flexDirection: isDesktop ? 'row' : 'column',
                gap:           isDesktop ? 16 : 8,
                alignItems:    isDesktop ? 'center' : 'flex-start',
                flex:          isDesktop ? undefined : '1 0 calc(50% - 12px)',
              }}
            >
              <p style={{
                fontFamily:    "'ABCWhyteInktrap', sans-serif",
                fontWeight:    700,
                fontSize:      isDesktop ? '48px' : '40px',
                lineHeight:    0.96,
                letterSpacing: '-0.05em',
                color:         isDark ? '#F5F2EE' : '#0A0A0A',
                margin:        0,
                whiteSpace:    'nowrap',
              }}>
                {kpi.value}
              </p>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize:   isDesktop ? '18px' : '16px',
                lineHeight: 'normal',
                color:      isDark ? 'rgba(245,242,238,0.7)' : '#0A0A0A',
              }}>
                <p style={{ margin: 0 }}>{kpi.line1}</p>
                {kpi.line2 && <p style={{ margin: 0 }}>{kpi.line2}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {!isDesktop && (
        <motion.img
          src={IMG.imgResultados}
          alt="Resultados do redesign Mercado Pago"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', display: 'block', marginTop: 48 }}
        />
      )}
    </section>
  )
}

/* ── SECTION 08 — Results (Experience Improvements) ── */
function ResultsExperienceSection({ isDesktop, isDark, t }) {
  const [ref, inView] = useInView({ threshold: 0.1 })

  const bullets = [
    { bold: t('project.mp.s08.b1.bold'), text: t('project.mp.s08.b1.text') },
    { bold: t('project.mp.s08.b2.bold'), text: t('project.mp.s08.b2.text') },
    { bold: t('project.mp.s08.b3.bold'), text: t('project.mp.s08.b3.text') },
  ]

  return (
    <section
      ref={ref}
      style={{
        paddingTop:    isDesktop ? '80px' : '80px',
        paddingBottom: isDesktop ? '180px' : '80px',
        paddingLeft:   isDesktop ? '324px' : '24px',
        paddingRight:  isDesktop ? 0 : '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 48 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ ...T.sectionTitle(isDesktop, isDark), textAlign: 'left' }}>
            {t('project.mp.s08.title')}
          </h2>
          <p style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    500,
            fontSize:      isDesktop ? '24px' : '20px',
            color:         isDark ? '#777' : '#666666',
            letterSpacing: '-0.05em',
            margin:        0,
          }}>
            {t('project.mp.s08.subtitle')}
          </p>
        </div>

        <ul style={{ listStyle: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 20, margin: 0 }}>
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...T.body(isDesktop, isDark), paddingLeft: 4 }}
            >
              <strong style={T.boldInline(isDark)}>{b.bold}</strong>
              {b.text}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

/* ══════════════ PAGE ══════════════ */
export default function ProjetoMercadoPago() {
  const { t }      = useLang()
  const { isDark } = useTheme()
  const isDesktop  = useIsDesktop()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const resultsRef  = useRef(null)
  const { scrollYProgress } = useScroll({
    target:  resultsRef,
    offset:  ['start end', 'end start'],
  })
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const imageY = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [60, -60])

  const props = { isDesktop, isDark, t }

  return (
    <>
      <Navbar />
      <main style={{
        background:  isDark ? '#0A0A0A' : '#ffffff',
        overflowX:   'clip',
        transition:  'background-color 0.4s ease',
      }}>
        <HeroSection        {...props} />
        <IntroSection       {...props} />
        <ProblemSection     {...props} />
        <StrategySection1   {...props} />
        <StrategySection2   {...props} />
        <VideoSection       {...props} />
        <TelasSection       {...props} />
        {isDesktop ? (
          <div ref={resultsRef} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ResultsBusinessSection   {...props} />
              <ResultsExperienceSection {...props} />
            </div>
            <div style={{
              width:         '45%',
              flexShrink:    0,
              position:      'sticky',
              top:           80,
              alignSelf:     'flex-start',
              paddingRight:  '16%',
              paddingTop:    '120px',
              paddingBottom: '180px',
            }}>
              <motion.img
                src={IMG.imgResultados}
                alt="Resultados do redesign Mercado Pago"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', display: 'block', borderRadius: 24, y: imageY }}
              />
            </div>
          </div>
        ) : (
          <>
            <ResultsBusinessSection   {...props} />
            <ResultsExperienceSection {...props} />
          </>
        )}
      </main>
      <Contact />
    </>
  )
}
