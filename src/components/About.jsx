import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useTextStyle } from '../hooks/useTextStyle'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'

const STATS_BASE = [
  { labelKey: 'about.stat0.label', value: 15,  prefix: '+', suffix: '',  descKey: 'about.stat0.desc' },
  { labelKey: 'about.stat1.label', value: 300, prefix: '+', suffix: '',  descKey: 'about.stat1.desc' },
  { labelKey: 'about.stat2.label', value: 100, prefix: '',  suffix: '%', descKey: 'about.stat2.desc' },
]

function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const fn = () => setOk(window.innerWidth >= 1024)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return ok
}

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])
  return count
}

function StatRow({ stat, sectionInView, statsInView, delay, isDesktop, isDark }) {
  const count = useCounter(stat.value, sectionInView || statsInView)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        borderTop:      '1px solid rgba(102,102,102,0.4)',
        minHeight:      '64px',
        gap:            '16px',
      }}
    >
      <div style={{
        fontFamily:         "'ABCWhyteMono', monospace",
        fontSize:           isDesktop ? '16px' : '12px',
        fontWeight:         400,
        lineHeight:         '121.624%',
        letterSpacing:      isDesktop ? '1.6px' : '1.2px',
        textTransform:      'uppercase',
        fontFeatureSettings: "'liga' off, 'clig' off",
        color:              isDark ? '#999' : '#666',
        whiteSpace:         'pre-line',
        flexShrink:         0,
      }}>
        {stat.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{
          fontFamily: "'ABCWhyteInktrap', sans-serif",
          fontSize:   '40px',
          lineHeight: '34px',
          color:      '#EF3537',
          fontWeight: 400,
        }}>
          {stat.prefix}{count}{stat.suffix}
        </span>
        <span style={{
          fontFamily: "'ABCWhyte', sans-serif",
          fontSize:   '16px',
          lineHeight: '17px',
          color:      '#EF3537',
          whiteSpace: 'pre-line',
        }}>
          {stat.desc}
        </span>
      </div>
    </motion.div>
  )
}

export default function About() {
  const isDesktop               = useIsDesktop()
  const [ref,      inView]      = useInView({ threshold: 0.05 })
  const [statsRef, statsInView] = useInView({ threshold: 0.1 })
  const { isDark }  = useTheme()
  const { t }       = useLang()
  const heading     = useTextStyle('about-heading')
  const bio         = useTextStyle('about-bio')
  const decorFilter = isDark ? 'brightness(0.21)' : 'none'
  const bioColor    = isDark ? '#FFFFFF' : '#0A0A0A'
  const bioStyle    = { ...bio.style, color: bioColor }

  const stats = STATS_BASE.map(s => ({ ...s, label: t(s.labelKey), desc: t(s.descKey) }))

  /* ── Parallax (hooks must be unconditional) ── */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawPhotoY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const rawSvgY   = useTransform(scrollYProgress, [0, 1], [40, -100])
  const photoY    = useSpring(rawPhotoY, { stiffness: 60, damping: 20 })
  const svgY      = useSpring(rawSvgY,   { stiffness: 40, damping: 15 })

  const bioEl = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ ...bioStyle, margin: 0 }}>
        {t('about.bio1')}{' '}
        <strong style={{ fontWeight: 700, color: bioColor }}>{t('about.bio1.bold1')}</strong>{' '}
        {t('about.bio1.and')}{' '}
        <strong style={{ fontWeight: 700, color: bioColor }}>{t('about.bio1.bold2')}</strong>
        {t('about.bio1.end')}
      </p>
      <p style={{ ...bioStyle, margin: 0 }}>
        {t('about.bio2.start')}{' '}
        <strong style={{ fontWeight: 700, color: bioColor }}>{t('about.bio2.bold1')}</strong>
        {t('about.bio2.mid1')}{' '}
        <strong style={{ fontWeight: 700, color: bioColor }}>{t('about.bio2.bold2')}</strong>{' '}
        {t('about.bio2.mid2')}{' '}
        <strong style={{ fontWeight: 700, color: bioColor }}>{t('about.bio2.bold3')}</strong>
        {t('about.bio2.end')}
      </p>
    </div>
  )

  const statsEl = (
    <div
      ref={statsRef}
      style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '48px' }}
    >
      {stats.map((stat, i) => (
        <StatRow key={i} stat={stat} sectionInView={inView} statsInView={statsInView} delay={0.35 + i * 0.12} isDesktop={isDesktop} isDark={isDark} />
      ))}
    </div>
  )

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <section
        id="sobre"
        ref={ref}
        className="bg-[var(--bg-secondary)]"
        style={{ position: 'relative' }}
      >
        {/* Heading — absolutely centered across the full section width */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:       'absolute',
            top:            '136px',
            left:           0,
            right:          0,
            display:        'flex',
            justifyContent: 'center',
            zIndex:         10,
            pointerEvents:  'none',
          }}
        >
          <h2 style={{ ...heading.style, whiteSpace: 'pre-line' }}>
            {heading.content}
          </h2>
        </motion.div>

        {/* raio.svg — parallax, overlapping photo */}
        <motion.img
          src="/images/raio.svg"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position:      'absolute',
            left:          '18px',
            top:           '715px',
            width:         '225px',
            height:        '367px',
            pointerEvents: 'none',
            objectFit:     'contain',
            filter:        decorFilter,
            zIndex:        2,
            y:             svgY,
          }}
        />

        {/* Two-column grid: photo | bio+stats */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '5fr 7fr',
          gap:                 '162px',
          paddingLeft:         '162px',
          paddingRight:        '162px',
          paddingTop:          '229px',
          paddingBottom:       '80px',
        }}>

          {/* Left — sticky photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:  'sticky',
              top:       '100px',
              alignSelf: 'start',
              zIndex:    1,
            }}
          >
            {/* Photo */}
            <div style={{ borderRadius: '40px', overflow: 'hidden', aspectRatio: '3 / 4', position: 'relative' }}>
              <img
                src="/images/foto-davidhulle.png"
                alt="David Hulle"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          </motion.div>

          {/* Right — bio + stats, pushed down to clear the heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingTop: '261px' }}
          >
            {bioEl}
            {statsEl}
          </motion.div>

        </div>
      </section>
    )
  }

  /* ── MOBILE ── */
  return (
    <section id="sobre" ref={ref} className="bg-[var(--bg-secondary)]" style={{ paddingTop: '80px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>

      {/* raio.svg — parallax, left side */}
      <motion.img
        src="/images/raio.svg"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position:      'absolute',
          left:          '-23px',
          top:           '498px',
          width:         '121px',
          height:        '198px',
          pointerEvents: 'none',
          objectFit:     'contain',
          filter:        decorFilter,
          zIndex:        2,
          y:             svgY,
        }}
      />

      <div className="max-w-7xl mx-auto section-px" style={{ position: 'relative', zIndex: 1 }}>

        {/* Heading centered, overlapping photo top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 10, marginBottom: '-28px', display: 'flex', justifyContent: 'center' }}
        >
          <h2 style={{ ...heading.style, whiteSpace: 'pre-line', textAlign: 'center' }}>
            <span style={{ display: 'block', lineHeight: 'normal' }}>{t('about.heading.line1')}</span>
            <span style={{ display: 'block', lineHeight: '4px' }}>{t('about.heading.line2')}</span>
          </h2>
        </motion.div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '3 / 4' }}
        >
          <img
            src="/images/foto-davidhulle.png"
            alt="David Hulle"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '32px' }}
        >
          {bioEl}
        </motion.div>

        {/* Stats */}
        {statsEl}

      </div>
    </section>
  )
}
