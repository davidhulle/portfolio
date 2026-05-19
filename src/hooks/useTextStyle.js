import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 1024)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

function px(v) { return `${v}px` }

const STYLES = {
  'hero-title': {
    contentKey: null, content: 'UX/UI Design Leader',
    desktop: { fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: px(74.346), fontWeight: 573, lineHeight: px(76.204), letterSpacing: px(-3.717), color: '#F5F2EE' },
    mobile:  { fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: px(32),     fontWeight: 573, lineHeight: px(41),     letterSpacing: px(-1.6),  color: '#F5F2EE' },
  },
  'hero-subtitle': {
    contentKey: null, content: 'Strategy & Tech',
    desktop: { fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: px(59.476), fontWeight: 185, lineHeight: px(55.759), letterSpacing: px(10.706), color: '#F5F2EE' },
    mobile:  { fontFamily: "'ABCWhyteInktrap', sans-serif", fontSize: px(24),     fontWeight: 185, lineHeight: px(30),     letterSpacing: px(4.32),   color: '#F5F2EE' },
  },

  'projects-heading': {
    contentKey: 'heading.projects',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(200), fontWeight: 400, lineHeight: 'normal', letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(72),  fontWeight: 400, lineHeight: 'normal', letterSpacing: '0', color: '#101010' },
  },

  'about-heading': {
    contentKey: 'heading.about',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(200), fontWeight: 400, lineHeight: px(120), letterSpacing: '0', color: '#EF3537', textAlign: 'center' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(72),  fontWeight: 400, lineHeight: px(47),  letterSpacing: '0', color: '#EF3537', textAlign: 'center' },
  },
  'about-bio': {
    contentKey: null, content: '',
    desktop: { fontFamily: "'Inter', sans-serif", fontSize: px(24), fontWeight: 400, lineHeight: px(32), letterSpacing: '0.48px', alignSelf: 'stretch' },
    mobile:  { fontFamily: "'Inter', sans-serif", fontSize: px(16), fontWeight: 400, lineHeight: px(24), letterSpacing: '0.32px', alignSelf: 'stretch' },
  },

  'skills-heading': {
    contentKey: 'heading.skills',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(128), fontWeight: 400, lineHeight: px(110), letterSpacing: '0', color: '#EF3537' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(56),  fontWeight: 400, lineHeight: 'normal', letterSpacing: '0', color: '#EF3537' },
  },

  'impact-heading': {
    contentKey: 'heading.impact',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(88), fontWeight: 400, lineHeight: px(79.2), letterSpacing: '0', color: '#FFFFFF' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(40), fontWeight: 400, lineHeight: px(36),   letterSpacing: '0', color: '#FFFFFF' },
  },

  'journey-heading': {
    contentKey: 'heading.journey',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(128), fontWeight: 400, lineHeight: px(110), letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(56),  fontWeight: 400, lineHeight: 'normal', letterSpacing: '0', color: '#101010' },
  },

  'contact-heading': {
    contentKey: 'heading.contact',
    desktop: { fontFamily: "'Network', cursive", fontSize: px(160), fontWeight: 400, lineHeight: px(144),  letterSpacing: '0', color: '#FFFFFF' },
    mobile:  { fontFamily: "'Network', cursive", fontSize: px(64),  fontWeight: 400, lineHeight: px(57.6), letterSpacing: '0', color: '#FFFFFF' },
  },
  'contact-subheading': {
    contentKey: 'heading.contact.sub',
    desktop: { fontFamily: "'ABCWhyte', sans-serif", fontSize: px(20), fontWeight: 400, lineHeight: px(28), letterSpacing: '0', color: '#F5F2EE' },
    mobile:  { fontFamily: "'ABCWhyte', sans-serif", fontSize: px(16), fontWeight: 400, lineHeight: px(24), letterSpacing: '0', color: '#F5F2EE' },
  },
}

export function useTextStyle(id) {
  const isMobile = useIsMobile()
  const { t }    = useLang()
  const entry    = STYLES[id]
  if (!entry) return { style: {}, content: '' }
  const bp      = isMobile ? 'mobile' : 'desktop'
  const content = entry.contentKey ? t(entry.contentKey) : (entry.content ?? '')
  return { style: entry[bp], content }
}
