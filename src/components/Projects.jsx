import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useTextStyle } from '../hooks/useTextStyle'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'

const PROJECTS_BASE = [
  { id: 1, titleKey: 'projects.0.title', client: 'Mercado Pago', tags: ['Leadership', 'Finance'],           img: '/images/projects/mercadopago-desktop.png', imgMobile: '/images/projects/mercadopago-mobile.png', href: '/projeto/mercado-pago' },
  { id: 2, titleKey: 'projects.1.title', client: 'Boa Praça',    tags: ['UX/UI', 'Ecommerce', 'Leadership'], img: '/images/projects/boapraca-desktop.png',     imgMobile: '/images/projects/boapraca-mobile.png',   href: '#' },
  { id: 3, titleKey: 'projects.2.title', client: 'Itaú',         tags: ['UX/UI', 'Finance'],                img: '/images/projects/agro-desktop.png',          imgMobile: '/images/projects/agro-mobile.png',       href: '#' },
  { id: 4, titleKey: 'projects.3.title', client: 'Wine',         tags: ['UX/UI', 'Ecommerce'],              img: '/images/projects/wine-desktop.png',          imgMobile: '/images/projects/wine-mobile.png',       href: '#' },
  { id: 5, titleKey: 'projects.4.title', client: 'Degrau',       tags: ['UX/UI', 'Ecommerce'],              img: '/images/projects/degrau-desktop.png',         imgMobile: '/images/projects/degrau-mobile.png',     href: '#' },
]

/* ── Checkerboard CSS background (Figma-style image placeholder) ── */
const CHECKER = {
  backgroundImage: 'repeating-conic-gradient(#D4D4D4 0% 25%, #E9E9E9 0% 50%)',
  backgroundSize: '28px 28px',
}

const GAP = 16

/* ── Responsive padding: mobile 24px · desktop (≥1024px) 162px ── */
function useSectionPad() {
  const [pad, setPad] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 162 : 24
  )
  useEffect(() => {
    const update = () => setPad(window.innerWidth >= 1024 ? 162 : 24)
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  return pad
}

export default function Projects() {
  const [ref, inView]           = useInView()
  const navigate                = useNavigate()
  const scrollRef               = useRef(null)
  const [active, setActive]     = useState(0)
  const [hovered, setHovered]   = useState(null)
  const heading                 = useTextStyle('projects-heading')
  const { isDark }              = useTheme()
  const { t }                   = useLang()
  const projects                = PROJECTS_BASE.map(p => ({ ...p, title: t(p.titleKey) }))
  const padX                    = useSectionPad()
  const [winW, setWinW]         = useState(() => typeof window !== 'undefined' ? window.innerWidth  : 390)
  const [winH, setWinH]         = useState(() => typeof window !== 'undefined' ? window.innerHeight : 844)
  useEffect(() => {
    const onResize = () => { setWinW(window.innerWidth); setWinH(window.innerHeight) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const isDesktop               = padX === 162
  const decorFilter             = isDark ? 'brightness(0.21)' : 'none'

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawRaioY    = useTransform(scrollYProgress, [0, 1], [80, -120])
  const rawHeadingY = useTransform(scrollYProgress, [0, 1], [0,  -55])
  const rawCardsY   = useTransform(scrollYProgress, [0, 1], [0,  -20])
  const raioY       = useSpring(rawRaioY,    { stiffness: 50, damping: 16 })
  const headingY    = useSpring(rawHeadingY, { stiffness: 60, damping: 20 })
  const cardsY      = useSpring(rawCardsY,   { stiffness: 60, damping: 20 })

  const cardW                   = isDesktop ? 786 : winW - padX - 60
  const carouselH               = isDesktop ? 430 : Math.max(482, Math.round(winH * 0.687))

  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })
  const velRef    = useRef(0)
  const prevXRef  = useRef(0)
  const prevTRef  = useRef(0)
  const rafRef    = useRef(null)

  const snapToNearest = useCallback(() => {
    const c = scrollRef.current
    if (!c) return
    c.style.scrollSnapType = 'x mandatory'
    const pl = parseFloat(getComputedStyle(c).paddingLeft) || 0
    const cards = Array.from(c.querySelectorAll('[data-card]'))
    if (c.scrollLeft >= c.scrollWidth - c.clientWidth - 1) {
      setActive(cards.length - 1)
      return
    }
    let closest = 0, minDist = Infinity
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - pl - c.scrollLeft)
      if (d < minDist) { minDist = d; closest = i }
    })
    const target = cards[closest]
    if (target) c.scrollTo({ left: target.offsetLeft - pl, behavior: 'smooth' })
    setActive(closest)
  }, [])

  const onMouseDown = useCallback((e) => {
    const c = scrollRef.current
    if (!c) return
    cancelAnimationFrame(rafRef.current)
    c.style.scrollSnapType = 'none'
    dragState.current = { active: true, startX: e.pageX, scrollLeft: c.scrollLeft, moved: false }
    velRef.current  = 0
    prevXRef.current = e.pageX
    prevTRef.current = performance.now()
    c.style.cursor = 'grabbing'
    c.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e) => {
    const ds = dragState.current
    if (!ds.active) return
    const now = performance.now()
    const dt  = now - prevTRef.current
    if (dt > 0) velRef.current = (prevXRef.current - e.pageX) / dt * 16
    prevXRef.current = e.pageX
    prevTRef.current = now
    const dx = e.pageX - ds.startX
    if (Math.abs(dx) > 4) ds.moved = true
    scrollRef.current.scrollLeft = ds.scrollLeft - dx
  }, [])

  const onMouseUp = useCallback(() => {
    const c = scrollRef.current
    if (!c || !dragState.current.active) return
    dragState.current.active = false
    c.style.cursor = 'grab'
    c.style.userSelect = ''
    let vel = velRef.current
    const friction = 0.93
    const tick = () => {
      vel *= friction
      c.scrollLeft += vel
      if (Math.abs(vel) > 0.8) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        snapToNearest()
      }
    }
    if (Math.abs(vel) > 1) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      snapToNearest()
    }
  }, [snapToNearest])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [onMouseMove, onMouseUp])

  const scrollToCard = useCallback((idx) => {
    const c = scrollRef.current
    if (!c) return
    const cards = Array.from(c.querySelectorAll('[data-card]'))
    if (!cards[idx]) return
    const pl = parseFloat(getComputedStyle(c).paddingLeft) || 0
    c.scrollTo({ left: cards[idx].offsetLeft - pl, behavior: 'smooth' })
    setActive(idx)
  }, [])

  useEffect(() => {
    const c = scrollRef.current
    if (!c) return
    const onScroll = () => {
      const pl = parseFloat(getComputedStyle(c).paddingLeft) || 0
      const cards = Array.from(c.querySelectorAll('[data-card]'))
      if (c.scrollLeft >= c.scrollWidth - c.clientWidth - 1) {
        setActive(cards.length - 1)
        return
      }
      let closest = 0, minDist = Infinity
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - pl - c.scrollLeft)
        if (d < minDist) { minDist = d; closest = i }
      })
      setActive(closest)
    }
    c.addEventListener('scroll', onScroll, { passive: true })
    return () => c.removeEventListener('scroll', onScroll)
  }, [])

  const step     = isDesktop ? 2 : 1
  const dotCount = isDesktop ? Math.ceil(projects.length / 2) : projects.length
  const activeDot = isDesktop ? Math.floor(active / 2) : active

  const scrollToDot = useCallback((dotIdx) => {
    scrollToCard(isDesktop ? dotIdx * 2 : dotIdx)
  }, [isDesktop, scrollToCard])

  const nav = (
    <div className="flex items-center gap-5">
      {/* Prev */}
      <button
        onClick={() => scrollToCard(Math.max(0, active - step))}
        disabled={activeDot === 0}
        aria-label={t('projects.aria.prev')}
        className="hidden md:flex w-8 h-8 items-center justify-center disabled:opacity-20 transition-opacity"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="flex items-center gap-[8px]">
        {Array.from({ length: dotCount }, (_, i) => (
          <button
            key={i}
            onClick={() => scrollToDot(i)}
            aria-label={`${t('projects.aria.dot')} ${i + 1}`}
            aria-current={i === activeDot ? 'true' : undefined}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === activeDot ? '10px' : '7px',
              height:     i === activeDot ? '10px' : '7px',
              background: 'var(--text)',
              opacity:    i === activeDot ? 1 : 0.25,
              border:     'none',
              cursor:     'pointer',
              padding:    0,
            }}
          />
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => scrollToCard(Math.min(projects.length - 1, active + step))}
        disabled={activeDot === dotCount - 1}
        aria-label={t('projects.aria.next')}
        className="hidden md:flex w-8 h-8 items-center justify-center disabled:opacity-20 transition-opacity"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  )

  return (
    <section id="projetos" ref={ref} className="bg-[var(--bg-secondary)] overflow-hidden" style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Raio — decorative, background parallax */}
      <motion.img
        src="/images/coroa.svg"
        alt="" aria-hidden="true"
        style={{
          position:      'absolute',
          right:         isDesktop ? '-20px' : '-10px',
          top:           isDesktop ? '190px' : '130px',
          width:         isDesktop ? '280px' : '160px',
          height:        'auto',
          pointerEvents: 'none',
          filter:        decorFilter,
          zIndex:        0,
          y:             raioY,
        }}
      />

      {/* Vertical padding: mobile 80/16 · desktop 125/185 */}
      <div style={{ paddingTop: padX === 162 ? '125px' : '112px', paddingBottom: padX === 162 ? '185px' : '80px', position: 'relative', zIndex: 1 }}>

        {/* ── Header row ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingLeft: `${padX}px`, paddingRight: `${padX}px`, y: headingY }}
          className="flex items-end justify-between"
        >
          <h2
            style={{ ...heading.style, ...(isDark ? { color: '#fff' } : {}), lineHeight: 'normal' }}
            className="leading-none"
          >
            {heading.content}
          </h2>
        </motion.div>

        {/* ── Carousel: left padding matches header, right adds trailing space ── */}
        <motion.div style={{ marginTop: isDesktop ? '-40px' : '-16px', position: 'relative', zIndex: 1, y: cardsY }}>
          <div
            ref={scrollRef}
            className="no-scrollbar"
            style={{
              display:          'flex',
              overflowX:        'auto',
              scrollSnapType:   'x mandatory',
              gap:                      `${isDesktop ? GAP : 8}px`,
              paddingLeft:              `${padX}px`,
              paddingRight:             `${padX}px`,
              scrollPaddingLeft:        `${padX}px`,
              height:                   `${carouselH}px`,
              cursor:                   'grab',
              WebkitOverflowScrolling:  'touch',
            }}
            onMouseDown={onMouseDown}
          >
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              data-card
              className="relative group"
              initial={{ y: 560 }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                scrollSnapAlign: 'start',
                width:           `${cardW}px`,
                flexShrink:      0,
                alignSelf:       'stretch',
                cursor:          p.href !== '#' ? 'pointer' : 'grab',
              }}
              onClick={() => { if (!dragState.current.moved && p.href !== '#') navigate(p.href) }}
              onMouseEnter={() => isDesktop && setHovered(p.id)}
              onMouseLeave={() => isDesktop && setHovered(null)}
            >
              {/* Inner div scales — outer article keeps layout size so gaps stay fixed */}
              <motion.div
                animate={{
                  scale: isDesktop
                    ? (hovered === null ? 1 : hovered === p.id ? 1 : 0.94)
                    : (active === i ? 1 : 0.92),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  width:           '100%',
                  height:          '100%',
                  borderRadius:    '40px',
                  overflow:        'hidden',
                  display:         'flex',
                  flexDirection:   'column',
                  justifyContent:  'flex-end',
                  alignItems:      'flex-start',
                  willChange:      'transform',
                  ...(() => {
                    const src = isDesktop ? p.img : (p.imgMobile ?? p.img)
                    return src
                      ? { backgroundImage: `url(${src})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
                      : CHECKER
                  })(),
                }}
              >
              {/* Coming soon badge */}
              {p.href === '#' && (
                <div style={{
                  position:             'absolute',
                  top:                  20,
                  left:                 20,
                  zIndex:               5,
                  padding:              '6px 14px',
                  borderRadius:         100,
                  background:           'rgba(10,10,10,0.45)',
                  backdropFilter:       'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border:               '1px solid rgba(255,255,255,0.18)',
                  color:                '#ffffff',
                  fontFamily:           "'ABCWhyte', sans-serif",
                  fontSize:             '11px',
                  fontWeight:           500,
                  letterSpacing:        '0.8px',
                  textTransform:        'uppercase',
                  whiteSpace:           'nowrap',
                }}>
                  {t('projects.comingSoon')}
                </div>
              )}

              {/* Info strip — pinned to bottom by card's flex column + justify-end */}
              <div
                style={{
                  display:              'flex',
                  alignItems:           'flex-start',
                  alignSelf:            'stretch',
                  borderRadius:         '0 0 40px 40px',
                  background:           'rgba(10, 10, 10, 0.30)',
                  backdropFilter:       'blur(10.5px)',
                  WebkitBackdropFilter: 'blur(10.5px)',
                  position:             'relative',
                  zIndex:               10,
                  ...(isDesktop
                    ? { padding: '32px 32px 40px 32px', gap: '24px' }
                    : { padding: '24px', justifyContent: 'space-between' }),
                }}
              >
                {/* Left: title + tags stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      alignSelf:         'stretch',
                      color:             '#FFF',
                      fontFamily:        'ABCWhyteInktrap, sans-serif',
                      fontSize:          isDesktop ? '24px' : '18px',
                      fontStyle:         'normal',
                      fontWeight:        700,
                      lineHeight:        'normal',
                      textTransform:     'uppercase',
                      display:           '-webkit-box',
                      WebkitLineClamp:   2,
                      WebkitBoxOrient:   'vertical',
                      overflow:          'hidden',
                      textOverflow:      'ellipsis',
                    }}
                  >
                    {p.title}
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, margin: '0 8px' }}>·</span>
                    {p.client}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', overflow: 'hidden' }}>
                    {p.tags.slice(0, 2).map(t => (
                      <span
                        key={t}
                        style={{
                          display:        'flex',
                          padding:        '12px',
                          justifyContent: 'center',
                          alignItems:     'center',
                          gap:            '10.129px',
                          borderRadius:   '100px',
                          border:         '1.013px solid #FFF',
                          color:          '#FFF',
                          textAlign:      'center',
                          fontFamily:     'ABCWhyte, sans-serif',
                          fontSize:       '12px',
                          fontStyle:      'normal',
                          fontWeight:     500,
                          lineHeight:     'normal',
                          letterSpacing:  '0.6px',
                          textTransform:  'uppercase',
                          flexShrink:     0,
                          whiteSpace:     'nowrap',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: arrow icon */}
                <div
                  role="presentation"
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s, transform 0.2s', transform: 'translate(0,0)', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,-2px)'; e.currentTarget.style.color = '#ffffff' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>
              </motion.div>
            </motion.article>
          ))}
        </div>

          {/* Mobile nav — centered, 24px below cards */}
          <motion.div
            className="md:hidden flex justify-center"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ marginTop: '24px' }}
          >
            {nav}
          </motion.div>

          {/* Desktop nav — left-aligned, 32px below cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="hidden md:flex"
            style={{ paddingLeft: `${padX}px`, marginTop: '32px' }}
          >
            {nav}
          </motion.div>
        </motion.div>

      </div>{/* end vertical padding wrapper */}
    </section>
  )
}
