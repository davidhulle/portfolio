import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

const ROWS_BASE = [
  { labelKey: null,                label: 'LINKEDIN', value: '/in/davidhulle',        href: 'https://www.linkedin.com/in/david-hulle/', blank: true  },
  { labelKey: null,                label: 'EMAIL',    value: 'contato@davidhulle.com', href: 'mailto:contato@davidhulle.com',     blank: false },
  { labelKey: 'contact.row.phone', label: 'TELEFONE', value: '+55 27 99922.0307',     href: 'https://wa.me/5527999220307',                blank: false },
]

const ArrowUpRight = ({ size = 32, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path
      d="M10 22L22 10M22 10H13M22 10V19"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
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

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const isDesktop     = useIsDesktop()
  const { t }         = useLang()
  const { isDark }    = useTheme()
  const ROWS          = ROWS_BASE.map(r => ({ ...r, label: r.labelKey ? t(r.labelKey) : r.label }))
  const labelColor    = isDark ? '#999999' : '#666666'

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <footer id="contato" ref={ref} style={{ background: '#000000', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '200px 8% 80px' }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '80px', alignItems: 'stretch' }}>

            {/* Left — display text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ alignSelf: 'start' }}
            >
              <p style={{
                fontFamily: "'Network', cursive",
                fontSize:   '140px',
                lineHeight: 0.64,
                color:      '#EF3537',
                margin:     0,
                userSelect: 'none',
              }}>
                {t('contact.cta.line1')}
              </p>
              <p style={{
                fontFamily: "'ABCWhyte', sans-serif",
                fontWeight: 300,
                fontSize:   '56px',
                lineHeight: '49px',
                color:      '#ffffff',
                margin:     '24px 0 0',
              }}>
                {t('contact.sub.line1')}<br />{t('contact.sub.line2')}
              </p>
            </motion.div>

            {/* Right — contact rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', alignSelf: 'end' }}>
              {ROWS.map((row, i) => (
                <motion.a
                  key={row.label}
                  href={row.href}
                  target={row.blank ? '_blank' : undefined}
                  rel={row.blank ? 'noopener noreferrer' : undefined}
                  aria-label={`${row.label}: ${row.value}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    borderTop:      '1px solid #666666',
                    height:         '50px',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    fontFamily:    "'ABCWhyteMono', monospace",
                    fontSize:      '20px',
                    fontWeight:    400,
                    lineHeight:    '24px',
                    color:         labelColor,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}>
                    {row.label}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: "'ABCWhyteInktrap', sans-serif",
                      fontSize:   '32px',
                      lineHeight: '34px',
                      color:      '#ffffff',
                      whiteSpace: 'nowrap',
                    }}>
                      {row.value}
                    </span>
                    <ArrowUpRight size={32} />
                  </span>
                </motion.a>
              ))}
            </div>

          </div>
        </div>
      </footer>
    )
  }

  /* ── MOBILE ── */
  return (
    <footer id="contato" ref={ref} style={{ background: '#000000', position: 'relative', overflow: 'hidden', height: '100svh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '160px 24px 48px' }}>

        {/* Top — CTA heading + subtitle */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Network', cursive",
              fontSize:   '80px',
              lineHeight: 0.665,
              color:      '#EF3537',
              margin:     0,
              userSelect: 'none',
              textAlign:  'center',
            }}
          >
            {t('contact.cta.line1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'ABCWhyte', sans-serif",
              fontWeight: 300,
              fontSize:   '20px',
              lineHeight: '19.748px',
              color:      '#ffffff',
              margin:     '24px 0 0',
              textAlign:  'center',
            }}
          >
            {t('contact.sub.line1')}<br />{t('contact.sub.line2')}
          </motion.p>
        </div>

        {/* Bottom — contact rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {ROWS.map((row, i) => (
            <motion.a
              key={row.label}
              href={row.href}
              target={row.blank ? '_blank' : undefined}
              rel={row.blank ? 'noopener noreferrer' : undefined}
              aria-label={`${row.label}: ${row.value}`}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display:        'flex',
                flexDirection:  'column',
                justifyContent: 'space-between',
                borderTop:      '1px solid #666666',
                height:         '75px',
                padding:        '15px 0 12px',
                textDecoration: 'none',
              }}
            >
              <span style={{
                fontFamily:    "'ABCWhyteMono', monospace",
                fontSize:      '14px',
                fontWeight:    400,
                lineHeight:    'normal',
                color:         labelColor,
                textTransform: 'uppercase',
                letterSpacing: '1.4px',
              }}>
                {row.label}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <span style={{
                  fontFamily: "'ABCWhyteInktrap', sans-serif",
                  fontSize:   '20px',
                  lineHeight: '34px',
                  color:      '#ffffff',
                  whiteSpace: 'nowrap',
                }}>
                  {row.value}
                </span>
                <ArrowUpRight size={24} />
              </span>
            </motion.a>
          ))}
        </div>

      </div>
    </footer>
  )
}
