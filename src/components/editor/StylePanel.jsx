import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditor, FONT_FAMILIES, toCSSBlock, getSections } from '../../context/EditorContext'

const BREAKPOINTS = [
  { key: 'desktop', label: 'Desktop', icon: '🖥' },
  { key: 'mobile',  label: 'Mobile',  icon: '📱' },
]

/* ── Reusable field wrapper ───────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

/* ── Number + unit input ──────────────────────────────────── */
function NumberInput({ value, onChange, step = '0.001', unit = 'px', min }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 focus-within:border-[#EF3537]/50 transition-colors"
         style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <input
        type="number" step={step} min={min} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-white text-sm font-mono outline-none w-0 min-w-0"
      />
      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>{unit}</span>
    </div>
  )
}

/* ── Color picker ─────────────────────────────────────────── */
function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 focus-within:border-[#EF3537]/50 transition-colors"
         style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <input
        type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
        style={{ appearance: 'none' }}
      />
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        maxLength={7}
        className="flex-1 bg-transparent text-white text-sm font-mono outline-none uppercase tracking-wider"
      />
    </div>
  )
}

/* ── Font family select ───────────────────────────────────── */
function SelectInput({ value, options, onChange }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2 text-white text-sm outline-none cursor-pointer appearance-none"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
      ))}
    </select>
  )
}

/* ── Weight slider + number ───────────────────────────────── */
function WeightInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range" min="100" max="900" step="1" value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 h-1 cursor-pointer accent-[#EF3537]"
      />
      <input
        type="number" min="100" max="900" value={value}
        onChange={e => onChange(e.target.value)}
        className="w-[56px] rounded-lg px-2 py-1.5 text-white text-sm font-mono text-center outline-none"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
      />
    </div>
  )
}

/* ── Copy button ──────────────────────────────────────────── */
function CopyBtn({ text, label = 'Copiar' }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000) }}
      className="flex items-center gap-1 text-[11px] font-bold transition-colors"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: ok ? '#4ade80' : '#EF3537' }}
    >
      {ok
        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Copiado!</>
        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>{label}</>
      }
    </button>
  )
}

/* ── Main panel ───────────────────────────────────────────── */
export default function StylePanel() {
  const {
    panelOpen, closePanel,
    elements, selectedId, setSelectedId,
    update, updateContent, save, reset,
  } = useEditor()

  const [bp, setBp]           = useState('desktop')
  const [showCSS, setShowCSS] = useState(false)
  const [search, setSearch]   = useState('')

  const el = elements[selectedId]
  if (!el) return null

  const styles     = el[bp]
  const sections   = getSections(elements)
  const cssOutput  = toCSSBlock(selectedId, el)

  const handleSave = () => { save(); closePanel() }

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 z-[90] lg:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-[91] flex flex-col"
            style={{ width: '360px', maxWidth: '100vw', background: '#0f0f0f', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#EF3537' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <span className="text-white text-sm font-bold">Editor de Estilos</span>
              </div>
              <button onClick={closePanel}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* ── Element list (grouped by section) ── */}
            <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Search */}
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3"
                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar elemento..."
                  className="flex-1 bg-transparent text-white text-xs outline-none"
                  style={{ '::placeholder': { color: 'rgba(255,255,255,0.3)' } }}
                />
              </div>

              {/* Grouped list */}
              <div className="max-h-44 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin' }}>
                {Object.entries(sections).map(([section, items]) => {
                  const filtered = items.filter(
                    el => !search || el.label.toLowerCase().includes(search.toLowerCase()) || section.toLowerCase().includes(search.toLowerCase())
                  )
                  if (!filtered.length) return null
                  return (
                    <div key={section}>
                      <p className="text-[9px] font-black tracking-[0.15em] uppercase mb-1.5 px-1"
                         style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {section}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {filtered.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={{
                              background: selectedId === item.id ? 'rgba(239,53,55,0.12)' : 'none',
                              border: `1px solid ${selectedId === item.id ? 'rgba(239,53,55,0.3)' : 'transparent'}`,
                              color: selectedId === item.id ? '#EF3537' : 'rgba(255,255,255,0.55)',
                              cursor: 'pointer',
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Scrollable style controls ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-4 space-y-4">

                {/* Content textarea */}
                <Field label="Conteúdo">
                  <textarea
                    value={el.content} rows={2}
                    onChange={e => updateContent(selectedId, e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none outline-none leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: 'inherit' }}
                  />
                </Field>

                {/* Breakpoint toggle */}
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase mb-2 block"
                         style={{ color: 'rgba(255,255,255,0.35)' }}>Breakpoint</label>
                  <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {BREAKPOINTS.map(b => (
                      <button
                        key={b.key} onClick={() => setBp(b.key)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-md transition-all"
                        style={{
                          background: bp === b.key ? '#EF3537' : 'none',
                          color: bp === b.key ? 'white' : 'rgba(255,255,255,0.45)',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        {b.icon} {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style fields */}
                <Field label="Font Family">
                  <SelectInput value={styles.fontFamily} options={FONT_FAMILIES}
                    onChange={v => update(selectedId, bp, 'fontFamily', v)} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Font Size">
                    <NumberInput value={styles.fontSize} step="0.001" min="1"
                      onChange={v => update(selectedId, bp, 'fontSize', v)} />
                  </Field>
                  <Field label="Line Height">
                    <NumberInput value={styles.lineHeight} step="0.001" min="1"
                      onChange={v => update(selectedId, bp, 'lineHeight', v)} />
                  </Field>
                </div>

                <Field label={`Font Weight — ${styles.fontWeight}`}>
                  <WeightInput value={styles.fontWeight}
                    onChange={v => update(selectedId, bp, 'fontWeight', v)} />
                </Field>

                <Field label="Letter Spacing">
                  <NumberInput value={styles.letterSpacing} step="0.001"
                    onChange={v => update(selectedId, bp, 'letterSpacing', v)} />
                </Field>

                <Field label="Color">
                  <ColorInput value={styles.color}
                    onChange={v => update(selectedId, bp, 'color', v)} />
                </Field>

                {/* CSS output */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase"
                           style={{ color: 'rgba(255,255,255,0.35)' }}>CSS Gerado</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowCSS(s => !s)}
                        className="text-[11px] transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}
                      >
                        {showCSS ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <CopyBtn text={cssOutput} label="Copiar CSS" />
                    </div>
                  </div>
                  {showCSS && (
                    <pre className="text-[10px] rounded-lg p-3 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap"
                         style={{ color: '#EF3537', background: 'rgba(239,53,55,0.05)', border: '1px solid rgba(239,53,55,0.12)' }}>
                      {cssOutput}
                    </pre>
                  )}
                </div>

              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center gap-2 px-5 py-4 flex-shrink-0"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => reset(selectedId)}
                className="text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}
              >
                Resetar
              </button>
              <div className="flex-1" />
              <button
                onClick={closePanel}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all"
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: '#EF3537', border: 'none', cursor: 'pointer' }}
              >
                Salvar
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
