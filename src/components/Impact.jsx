import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useTextStyle } from '../hooks/useTextStyle'
import { useLang } from '../context/LangContext'

function useCounter(target, inView, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])
  return count
}

const METRICS_BASE = [
  { value: 42,  suffix: '%',  labelKey: 'impact.metrics.0.label', descKey: 'impact.metrics.0.desc' },
  { value: 15,  suffix: 'M+', labelKey: 'impact.metrics.1.label', descKey: 'impact.metrics.1.desc' },
  { value: 200, suffix: '+',  labelKey: 'impact.metrics.2.label', descKey: 'impact.metrics.2.desc' },
  { value: 98,  suffix: '%',  labelKey: 'impact.metrics.3.label', descKey: 'impact.metrics.3.desc' },
]

const awards = [
  { title: 'Best UX Design 2023',  org: 'Brazil Digital Awards',  year: '2023' },
  { title: 'Design Excellence',    org: 'UX São Paulo Conference', year: '2022' },
  { title: 'Product Design Leader',org: 'Product Summit BR',       year: '2022' },
  { title: 'Innovation in Design', org: 'iF Design Award',         year: '2021' },
]

function MetricCard({ metric, inView, delay }) {
  const count = useCounter(metric.value, inView)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 border border-white/15 rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors duration-300"
    >
      <div className="font-heading font-black text-white leading-none mb-2"
           style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
        {count}{metric.suffix}
      </div>
      <p className="text-white font-heading font-bold text-sm mb-1">{metric.label}</p>
      <p className="text-white/50 text-xs font-body">{metric.desc}</p>
    </motion.div>
  )
}

export default function Impact() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const label   = useTextStyle('impact-label')
  const heading = useTextStyle('impact-heading')
  const { t }   = useLang()
  const metrics = METRICS_BASE.map(m => ({ ...m, label: t(m.labelKey), desc: t(m.descKey) }))

  return (
    <section
      id="impacto"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden bg-hero-gradient noise-overlay"
    >
      {/* Parallax glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,80,80,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(158,0,21,0.5) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto section-px">
        {/* Header */}
        <div className="mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...heading.style, whiteSpace: 'pre-line' }}
            {...heading}
            className="leading-none"
          >
            {heading.content}
          </motion.h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {metrics.map((m, i) => (
            <MetricCard key={i} metric={m} inView={inView} delay={i * 0.1} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/15 mb-14" />

        {/* Awards */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-xs font-heading font-bold tracking-widest uppercase mb-8"
        >
          {t('impact.awards.label')}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
              className="flex flex-col gap-1 p-5 border border-white/10 rounded-xl bg-white/5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-white/40 text-xs font-heading tracking-widest">{award.year}</span>
              </div>
              <p className="text-white font-heading font-bold text-sm leading-tight">{award.title}</p>
              <p className="text-white/50 text-xs font-body">{award.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
