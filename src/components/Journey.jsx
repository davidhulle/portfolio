import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useTextStyle } from '../hooks/useTextStyle'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'

const ENTRIES_BASE = [
  {
    logo:       { light: '/images/journey/mercadopago-light.png', dark: '/images/journey/mercadopago-dark.png' },
    logoH:      { desk: 85, mob: 64 },
    logoAlt:    'Mercado Pago',
    title:      'UX Design Lead',
    dateKey:    'journey.0.date',
    introKey:   'journey.0.boldIntro',
    bodyKey:    'journey.0.body',
  },
  {
    logo:       { light: '/images/journey/itau.png', dark: '/images/journey/itau.png' },
    logoH:      { desk: 85, mob: 64 },
    logoAlt:    'Itaú',
    title:      'Product Designer Specialist',
    dateKey:    'journey.1.date',
    introKey:   'journey.1.boldIntro',
    bodyKey:    'journey.1.body',
  },
  {
    logo:       { light: '/images/journey/wine-light.png', dark: '/images/journey/wine-dark.png' },
    logoH:      { desk: 85, mob: 64 },
    logoAlt:    'Wine.com.br',
    title:      'Senior Product Designer',
    dateKey:    'journey.2.date',
    introKey:   'journey.2.boldIntro',
    bodyKey:    'journey.2.body',
  },
  {
    logo:       { light: '/images/journey/balaio-banestes-light.png', dark: '/images/journey/balaio-banestes-dark.png' },
    logoH:      { desk: 85, mob: 64 },
    logoAlt:    'Balaio Comunicação / Banestes',
    title:      'Graphic Designer',
    dateKey:    'journey.3.date',
    introKey:   'journey.3.boldIntro',
    bodyKey:    'journey.3.body',
  },
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

const ArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#EF3537" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function JourneyEntry({ children, paddingLeft }) {
  const [entryRef, visible] = useInView({ threshold: 0.18 })
  return (
    <motion.div
      ref={entryRef}
      initial={{ opacity: 0, y: 52 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', paddingLeft }}
    >
      {children}
    </motion.div>
  )
}

export default function Journey() {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const timelineRef   = useRef(null)
  const [linePos, setLinePos] = useState(null)
  const heading    = useTextStyle('journey-heading')
  const { isDark } = useTheme()
  const { t }      = useLang()
  const isDesktop  = useIsDesktop()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawPlanetaY = useTransform(scrollYProgress, [0, 1], [30, -80])
  const rawSaturnoY = useTransform(scrollYProgress, [0, 1], [0,  -110])
  const planetaY    = useSpring(rawPlanetaY, { stiffness: 55, damping: 18 })
  const saturnoY    = useSpring(rawSaturnoY, { stiffness: 55, damping: 18 })
  const rawFillScale = useTransform(
    scrollYProgress,
    [0.10, 0.26, 0.32, 0.48, 0.54, 0.70, 0.82],
    [0,    0.33, 0.33, 0.67, 0.67, 1.00, 1.00]
  )
  const fillScale = useSpring(rawFillScale, { stiffness: 65, damping: 22 })
  const decorFilter  = isDark ? 'brightness(0.21)' : 'none'

  useEffect(() => {
    // offsetTop traversal ignores CSS transforms (Framer Motion y), giving true layout position
    const getLayoutTop = (el, container) => {
      let top = 0, cur = el
      while (cur && cur !== container) { top += cur.offsetTop; cur = cur.offsetParent }
      return top
    }
    const measure = () => {
      const el = timelineRef.current
      if (!el) return
      const dots = el.querySelectorAll('[data-dot]')
      if (dots.length < 2) return
      const first = dots[0], last = dots[dots.length - 1]
      const firstCenter = getLayoutTop(first, el) + first.offsetHeight / 2
      const lastCenter  = getLayoutTop(last,  el) + last.offsetHeight  / 2
      setLinePos({
        top:     Math.round(firstCenter),
        bottom:  Math.round(el.offsetHeight - lastCenter),
        stickyH: Math.round(lastCenter),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (timelineRef.current) ro.observe(timelineRef.current)
    return () => ro.disconnect()
  }, [isDesktop])

  const lineTop    = linePos?.top    ?? 43
  const lineBottom = linePos?.bottom ?? 43

  const ENTRIES = ENTRIES_BASE.map(e => ({
    ...e,
    date:      t(e.dateKey),
    boldIntro: t(e.introKey),
    body:      t(e.bodyKey),
  }))

  const textColor  = isDark ? '#ffffff' : '#0A0A0A'
  const dateColor  = isDark ? '#ffffff' : '#000000'
  const bodyColor  = isDark ? '#ffffff' : '#333333'
  const lineColor  = isDark ? 'rgba(245, 242, 238, 0.12)' : 'rgba(0, 0, 0, 0.12)'

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <section
        id="jornada"
        ref={ref}
        style={{ background: 'var(--bg-white)', position: 'relative', overflow: 'clip' }}
      >
        {/* planeta — top-left */}
        <motion.img
          src="/images/planeta.svg"
          alt="" aria-hidden="true" draggable={false}
          style={{
            position:      'absolute',
            top:           '40px',
            left:          '-100px',
            width:         '490px',
            height:        'auto',
            filter:        decorFilter,
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:        0,
            y:             planetaY,
          }}
        />

        {/* saturno — bottom-right, mirrored + rotated */}
        <motion.img
          src="/images/saturno.svg"
          alt="" aria-hidden="true" draggable={false}
          style={{
            position:      'absolute',
            bottom:        '-60px',
            right:         '-100px',
            width:         '540px',
            height:        'auto',
            filter:        decorFilter,
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:        0,
            scaleX:        -1,
            rotate:        15,
            y:             saturnoY,
          }}
        />

        <div style={{ padding: '144px 162px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 '48px',
            }}
          >
            {/* Left: Heading — sticky until last dot */}
            <div style={linePos?.stickyH ? { height: linePos.stickyH, alignSelf: 'start' } : {}}>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...heading.style, color: textColor, margin: 0, position: 'sticky', top: '144px' }}
              >
                {heading.content}
              </motion.h2>
            </div>

            {/* Right: entries + link */}
            <div>
              {/* Entries with vertical timeline */}
              <div ref={timelineRef} style={{ position: 'relative' }}>
                {/* Vertical line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  style={{
                    position:        'absolute',
                    left:            0,
                    top:             lineTop,
                    bottom:          lineBottom,
                    width:           '1px',
                    background:      lineColor,
                    transformOrigin: 'top',
                  }}
                />

                {/* Red fill overlay */}
                <motion.div
                  style={{
                    position:        'absolute',
                    left:            0,
                    top:             lineTop,
                    bottom:          lineBottom,
                    width:           '1px',
                    background:      '#EF3537',
                    transformOrigin: 'top',
                    scaleY:          fillScale,
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                  {ENTRIES.map((entry, i) => {
                    const logoSrc = isDark ? entry.logo.dark : entry.logo.light
                    return (
                      <JourneyEntry key={i} paddingLeft="44px">
                        {/* Timeline dot */}
                        <div
                          data-dot
                          style={{
                            position:     'absolute',
                            left:         '-5px',
                            top:          '38px',
                            width:        '10px',
                            height:       '10px',
                            borderRadius: '50%',
                            background:   '#EF3537',
                            boxShadow:    '0 0 0 4px rgba(239, 53, 55, 0.15)',
                          }}
                        />

                        {/* Logo area */}
                        <div style={{ height: '85px', display: 'flex', alignItems: 'center' }}>
                          <img
                            src={logoSrc}
                            alt={entry.logoAlt}
                            loading="lazy"
                            draggable={false}
                            style={{
                              height:          entry.logoH.desk,
                              width:           'auto',
                              maxWidth:        '280px',
                              objectFit:       'contain',
                              objectPosition:  'left center',
                              display:         'block',
                            }}
                          />
                        </div>

                        {/* Date */}
                        <p
                          style={{
                            fontFamily: "'ABCWhyteMono', monospace",
                            fontSize:   '16px',
                            fontWeight: 300,
                            lineHeight: 'normal',
                            color:      dateColor,
                            marginTop:  '16px',
                          }}
                        >
                          {entry.date}
                        </p>

                        {/* Title */}
                        <h3
                          style={{
                            fontFamily: "'ABCWhyte', sans-serif",
                            fontSize:   '32px',
                            fontWeight: 800,
                            lineHeight: 'normal',
                            color:      textColor,
                            marginTop:  '8px',
                          }}
                        >
                          {entry.title}
                        </h3>

                        {/* Description */}
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize:   '20px',
                            fontWeight: 400,
                            lineHeight: 1.4,
                            color:      bodyColor,
                            marginTop:  '24px',
                          }}
                        >
                          <strong style={{ fontWeight: 700, color: bodyColor }}>{entry.boldIntro}</strong>
                          {entry.body}
                        </p>
                      </JourneyEntry>
                    )
                  })}
                </div>
              </div>

              {/* Ver jornada completa */}
              <motion.a
                href="https://www.linkedin.com/in/david-hulle/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.85 }}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '6px',
                  fontFamily:     "'Inter', sans-serif",
                  fontSize:       '16px',
                  fontWeight:     400,
                  color:          '#EF3537',
                  textDecoration: 'none',
                  marginTop:      '80px',
                  paddingLeft:    '44px',
                }}
              >
                {t('journey.link')}
                <ArrowUpRight />
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── MOBILE ── */
  return (
    <section
      id="jornada"
      ref={ref}
      style={{ background: 'var(--bg-white)', position: 'relative', overflow: 'clip' }}
    >
      {/* planeta — top-right */}
      <motion.img
        src="/images/planeta.svg"
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:      'absolute',
          top:           '50px',
          right:         '-30px',
          width:         '220px',
          height:        'auto',
          filter:        decorFilter,
          pointerEvents: 'none',
          userSelect:    'none',
          zIndex:        0,
          y:             planetaY,
        }}
      />

      {/* saturno — bottom-right, mirrored + rotated */}
      <motion.img
        src="/images/saturno.svg"
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:      'absolute',
          bottom:        '-60px',
          right:         '-70px',
          width:         '340px',
          height:        'auto',
          filter:        decorFilter,
          pointerEvents: 'none',
          userSelect:    'none',
          zIndex:        0,
          scaleX:        -1,
          rotate:        15,
          y:             saturnoY,
        }}
      />

      <div style={{ paddingTop: '104px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...heading.style, color: textColor, margin: 0 }}
        >
          {heading.content}
        </motion.h2>

        {/* Timeline area */}
        <div ref={timelineRef} style={{ position: 'relative', marginTop: '32px' }}>

          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              position:        'absolute',
              left:            '16px',
              top:             lineTop,
              bottom:          lineBottom,
              width:           '1px',
              background:      lineColor,
              transformOrigin: 'top',
            }}
          />

          {/* Red fill overlay */}
          <motion.div
            style={{
              position:        'absolute',
              left:            '16px',
              top:             lineTop,
              bottom:          lineBottom,
              width:           '1px',
              background:      '#EF3537',
              transformOrigin: 'top',
              scaleY:          fillScale,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {ENTRIES.map((entry, i) => {
              const logoSrc = isDark ? entry.logo.dark : entry.logo.light
              return (
                <JourneyEntry key={i} paddingLeft="55px">
                  {/* Timeline dot */}
                  <div
                    data-dot
                    style={{
                      position:     'absolute',
                      left:         '11px',
                      top:          '28px',
                      width:        '10px',
                      height:       '10px',
                      borderRadius: '50%',
                      background:   '#EF3537',
                      boxShadow:    i === 0
                        ? '0 0 0 5px rgba(239, 53, 55, 0.15), 0 0 0 10px rgba(239, 53, 55, 0.06)'
                        : '0 0 0 4px rgba(239, 53, 55, 0.12)',
                    }}
                  />

                  {/* Logo area */}
                  <div style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
                    <img
                      src={logoSrc}
                      alt={entry.logoAlt}
                      loading="lazy"
                      draggable={false}
                      style={{
                        height:         entry.logoH.mob,
                        width:          'auto',
                        maxWidth:       '200px',
                        objectFit:      'contain',
                        objectPosition: 'left center',
                        display:        'block',
                      }}
                    />
                  </div>

                  {/* Date */}
                  <p
                    style={{
                      fontFamily: "'ABCWhyteMono', monospace",
                      fontSize:   '14px',
                      fontWeight: 300,
                      lineHeight: 'normal',
                      color:      dateColor,
                      marginTop:  '12px',
                    }}
                  >
                    {entry.date}
                  </p>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'ABCWhyte', sans-serif",
                      fontSize:   '24px',
                      fontWeight: 800,
                      lineHeight: 'normal',
                      color:      textColor,
                      marginTop:  '6px',
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      '16px',
                      fontWeight:    400,
                      lineHeight:    1.4,
                      letterSpacing: '0.32px',
                      color:         bodyColor,
                      marginTop:     '16px',
                    }}
                  >
                    <strong style={{ fontWeight: 700, color: bodyColor }}>{entry.boldIntro}</strong>
                    {entry.body}
                  </p>
                </JourneyEntry>
              )
            })}
          </div>

          {/* Ver jornada completa */}
          <motion.a
            href="https://www.linkedin.com/in/david-hulle/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.85 }}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              fontFamily:     "'Inter', sans-serif",
              fontSize:       '16px',
              fontWeight:     400,
              color:          '#EF3537',
              textDecoration: 'none',
              marginTop:      '56px',
              paddingLeft:    '55px',
            }}
          >
            Ver jornada completa
            <ArrowUpRight />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
