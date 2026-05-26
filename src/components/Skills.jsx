import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useTextStyle } from '../hooks/useTextStyle'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'
import LogoLoop from './LogoLoop'

const SKILLS_BASE = [
  { icon: '/images/skills/icon-write.gif', titleDeskKey: 'skills.0.titleDesk', titleMobKey: 'skills.0.titleMob', descKey: 'skills.0.desc' },
  { icon: '/images/skills/icon-users.gif', titleDeskKey: 'skills.1.titleDesk', titleMobKey: 'skills.1.titleMob', descKey: 'skills.1.desc' },
  { icon: '/images/skills/icon-ai.gif',    titleDeskKey: 'skills.2.titleDesk', titleMobKey: 'skills.2.titleMob', descKey: 'skills.2.desc' },
]

const TOOL_LOGOS_DESKTOP = [
  { src: '/images/tools/Claude.svg',  alt: 'Claude',  w: 172,     h: 37     },
  { src: '/images/tools/figma.svg',   alt: 'Figma',   w: 34,      h: 48     },
  { src: '/images/tools/Gemini.svg',  alt: 'Gemini',  w: 123,     h: 30     },
  { src: '/images/tools/Adobe.svg',   alt: 'Adobe',   w: 107.036, h: 27     },
  { src: '/images/tools/Vercel.svg',  alt: 'Vercel',  w: 63.262,  h: 31.659 },
  { src: '/images/tools/Cursor.svg',  alt: 'Cursor',  w: 156,     h: 37     },
  { src: '/images/tools/Lovable.svg', alt: 'Lovable', w: 159,     h: 27     },
  { src: '/images/tools/ChatGPB.svg', alt: 'ChatGPT', w: 163,     h: 48     },
]

const TOOL_LOGOS_MOBILE = [
  { src: '/images/tools/Claude.svg',  alt: 'Claude',  w: 114.667, h: 24.667 },
  { src: '/images/tools/figma.svg',   alt: 'Figma',   w: 22,      h: 32     },
  { src: '/images/tools/Gemini.svg',  alt: 'Gemini',  w: 82,      h: 20     },
  { src: '/images/tools/Adobe.svg',   alt: 'Adobe',   w: 71.357,  h: 18     },
  { src: '/images/tools/Vercel.svg',  alt: 'Vercel',  w: 42.174,  h: 21.106 },
  { src: '/images/tools/Cursor.svg',  alt: 'Cursor',  w: 104,     h: 24.79  },
  { src: '/images/tools/Lovable.svg', alt: 'Lovable', w: 106,     h: 18     },
  { src: '/images/tools/ChatGPB.svg', alt: 'ChatGPT', w: 108.667, h: 32.044 },
]

const renderLogoImg = item => (
  <img
    src={item.src}
    alt={item.alt ?? ''}
    loading="lazy"
    decoding="async"
    draggable={false}
    style={{
      width:         `${item.w}px`,
      height:        `${item.h}px`,
      display:       'block',
      objectFit:     'contain',
      filter:        'var(--logoloop-img-filter, none)',
      pointerEvents: 'none',
    }}
  />
)

function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const fn = () => setOk(window.innerWidth >= 1024)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return ok
}

export default function Skills() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const heading       = useTextStyle('skills-heading')
  const { isDark }    = useTheme()
  const { t }         = useLang()
  const isDesktop     = useIsDesktop()
  const SKILLS        = SKILLS_BASE.map(s => ({
    ...s,
    titleDesk: t(s.titleDeskKey),
    titleMob:  t(s.titleMobKey),
    desc:      t(s.descKey),
  }))
  const decorFilter   = isDark ? 'brightness(0.21)' : 'none'
  const textColor     = isDark ? '#FFFFFF' : '#0A0A0A'
  const logoFilter    = isDark
    ? 'brightness(0) invert(48.6%)'
    : 'brightness(0) invert(78%) sepia(15%) hue-rotate(-27deg)'
  const borderColor   = isDark ? 'rgba(124, 124, 124, 0.6)' : 'rgba(207, 194, 194, 0.6)'

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawAstY = useTransform(scrollYProgress, [0, 1], [60, -120])
  const astY    = useSpring(rawAstY, { stiffness: 40, damping: 15 })

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <section
        id="skills"
        ref={ref}
        style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}
      >
        {/* Floating ast — parallax */}
        <motion.img
          src="/images/olho.svg"
          alt=""
          aria-hidden="true"
          style={{
            position:      'absolute',
            right:         '-1.41%',
            top:           '5.74%',
            width:         '589px',
            height:        'auto',
            pointerEvents: 'none',
            userSelect:    'none',
            opacity:       0.9,
            filter:        decorFilter,
            zIndex:        0,
            y:             astY,
          }}
        />

        <div style={{ padding: '144px 162px 160px', position: 'relative', zIndex: 1 }}>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...heading.style, whiteSpace: 'pre-line', maxWidth: '759px' }}
          >
            {heading.content}
          </motion.h2>

          {/* Skill cards — 3 columns */}
          <div
            style={{
              display:               'grid',
              gridTemplateColumns:   'repeat(3, 1fr)',
              gap:                   '80px',
              marginTop:             '88px',
            }}
          >
            {SKILLS.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={skill.icon} alt="" style={{ width: 56, height: 56, display: 'block', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <h3
                  style={{
                    fontFamily:   "'ABCWhyteInktrap', sans-serif",
                    fontSize:     '32px',
                    fontWeight:   700,
                    lineHeight:   '34.186px',
                    color:        '#EF3537',
                    marginTop:    '24px',
                    whiteSpace:   'pre-line',
                  }}
                >
                  {skill.titleDesk}
                </h3>
                <p
                  style={{
                    fontFamily:   "'Inter', sans-serif",
                    fontSize:     '16px',
                    fontWeight:   400,
                    lineHeight:   '24px',
                    color:        textColor,
                    marginTop:    '24px',
                  }}
                >
                  {skill.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tool logos loop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              marginTop:  '88px',
              borderTop:  `1px solid ${borderColor}`,
              paddingTop: '44px',
              marginLeft: '-162px',
              marginRight: '-162px',
            }}
          >
            <LogoLoop
              logos={TOOL_LOGOS_DESKTOP}
              speed={60}
              direction="left"
              logoHeight={48}
              gap={64}
              pauseOnHover
              fadeOut
              fadeOutColor={isDark ? '#111111' : '#FFFFFF'}
              renderItem={renderLogoImg}
              ariaLabel={t('skills.tools.aria')}
              style={{ '--logoloop-img-filter': logoFilter }}
            />
          </motion.div>

        </div>
      </section>
    )
  }

  /* ── MOBILE ── */
  return (
    <section
      id="skills"
      ref={ref}
      style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Floating ast — parallax */}
      <motion.img
        src="/images/olho.svg"
        alt=""
        aria-hidden="true"
        style={{
          position:      'absolute',
          right:         '-7.91%',
          top:           '14.25%',
          width:         '198px',
          height:        'auto',
          pointerEvents: 'none',
          userSelect:    'none',
          opacity:       0.9,
          filter:        decorFilter,
          zIndex:        0,
          y:             astY,
        }}
      />

      <div style={{ paddingTop: '104px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '0', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...heading.style, whiteSpace: 'pre-line', maxWidth: '352px' }}
        >
          {heading.content}
        </motion.h2>

        {/* Skill cards — stacked */}
        <div
          style={{
            marginTop:      '78px',
            display:        'flex',
            flexDirection:  'column',
            gap:            '40px',
          }}
        >
          {SKILLS.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={skill.icon} alt="" style={{ width: 40, height: 40, display: 'block', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              <h3
                style={{
                  fontFamily:   "'ABCWhyteInktrap', sans-serif",
                  fontSize:     '24px',
                  fontWeight:   700,
                  lineHeight:   'normal',
                  color:        '#EF3537',
                  marginTop:    '16px',
                }}
              >
                {skill.titleMob}
              </h3>
              <p
                style={{
                  fontFamily:   "'Inter', sans-serif",
                  fontSize:     '16px',
                  fontWeight:   400,
                  lineHeight:   '24px',
                  color:        textColor,
                  marginTop:    '16px',
                }}
              >
                {skill.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tool logos loop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop:    '40px',
            borderTop:    `1px solid ${borderColor}`,
            paddingTop:   '43px',
            paddingBottom: '40px',
            marginLeft:   '-24px',
            marginRight:  '-24px',
          }}
        >
          <LogoLoop
            logos={TOOL_LOGOS_MOBILE}
            speed={55}
            direction="left"
            logoHeight={32}
            gap={48}
            pauseOnHover
            fadeOut
            fadeOutColor={isDark ? '#111111' : '#FFFFFF'}
            renderItem={renderLogoImg}
            ariaLabel="Ferramentas e tecnologias"
            style={{ '--logoloop-img-filter': logoFilter }}
          />
        </motion.div>

      </div>
    </section>
  )
}
