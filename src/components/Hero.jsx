import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTextStyle } from '../hooks/useTextStyle'
import { useTheme } from '../context/ThemeContext'

function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const fn = () => setOk(window.innerWidth >= 1024)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return ok
}

export default function Hero() {
  const ref       = useRef(null)
  const isDesktop = useIsDesktop()
  const { isDark } = useTheme()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY    = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), { stiffness: 50, damping: 18 })
  const textY   = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]),  { stiffness: 50, damping: 18 })
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const title    = useTextStyle('hero-title')
  const subtitle = useTextStyle('hero-subtitle')

  const pad    = isDesktop ? 16 : 8
  const radius = isDesktop ? 40 : 50

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        height:     '100svh',
        minHeight:  '600px',
        padding:    `${pad}px`,
        background: isDark ? '#0A0A0A' : '#fff',
        position:   'relative',
      }}
    >
      {/* Rounded card */}
      <div
        style={{
          width:        '100%',
          height:       '100%',
          borderRadius: `${radius}px`,
          overflow:     'hidden',
          position:     'relative',
          background:   'linear-gradient(140deg, #9E0015 0%, #C01228 30%, #EF3537 65%, #FF4D6B 85%, #FF7A8A 100%)',
        }}
      >
        {/* Parallax photo */}
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-0 w-full h-[110%] -top-[5%] pointer-events-none select-none"
        >
          <img
            src="/images/img-hero-desktop.png"
            alt=""
            aria-hidden="true"
            className="hidden md:block w-full h-full object-cover hero-img-desktop"
            draggable={false}
          />
          <img
            src="/images/img-hero-mobile.png"
            alt=""
            aria-hidden="true"
            className="md:hidden w-full h-full object-cover object-top"
            draggable={false}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(140deg, rgba(158,0,21,0.55) 0%, rgba(192,18,40,0.35) 40%, rgba(239,53,55,0.15) 70%, transparent 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(120,0,20,0.4))' }}
        />

        {/* Centered content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 section-px"
        >
          <motion.div
            aria-label="David Hulle"
            role="img"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mb-3 md:mb-4 pointer-events-none select-none flex-shrink-0"
            style={{
              backgroundColor:    '#9E0015',
              maskImage:          'url(/logos/logo-horizontal.svg)',
              WebkitMaskImage:    'url(/logos/logo-horizontal.svg)',
              maskSize:           'contain',
              WebkitMaskSize:     'contain',
              maskRepeat:         'no-repeat',
              WebkitMaskRepeat:   'no-repeat',
              maskPosition:       'center',
              WebkitMaskPosition: 'center',
              height:             'clamp(3rem, 10vw, 8.5rem)',
              width:              'calc(clamp(3rem, 10vw, 8.5rem) * 4.5)',
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            style={title.style}
          >
            {title.content}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            style={{ ...subtitle.style, marginTop: '0.3em' }}
          >
            {subtitle.content}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
          style={{ gap: 8 }}
        >
          <span style={{
            fontFamily:    "'ABCWhyteMono', monospace",
            fontSize:      9,
            fontWeight:    300,
            letterSpacing: '0.35em',
            color:         'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'rgba(255,255,255,0.8)' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
