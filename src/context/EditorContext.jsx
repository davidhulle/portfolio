import { createContext, useContext, useCallback, useState } from 'react'

export const FONT_FAMILIES = [
  { label: 'ABCWhyte Inktrap', value: 'ABCWhyteInktrap' },
  { label: 'ABCWhyte',         value: 'ABCWhyte' },
  { label: 'Network',          value: 'Network' },
  { label: 'Inter',            value: 'Inter' },
]

/* ─── Default values for every editable element ─────────────── */
const DEFAULTS = {
  // ── Hero ────────────────────────────────────────────────────
  'hero-title': {
    section: 'Hero', label: 'Título',
    content: 'UX/UI Design Leader',
    desktop: { fontFamily: 'ABCWhyteInktrap', fontSize: '74.346', fontWeight: '573', lineHeight: '76.204', letterSpacing: '-3.717', color: '#F5F2EE' },
    mobile:  { fontFamily: 'ABCWhyteInktrap', fontSize: '32',     fontWeight: '573', lineHeight: '41',     letterSpacing: '-1.6',   color: '#F5F2EE' },
  },
  'hero-subtitle': {
    section: 'Hero', label: 'Subtítulo',
    content: 'Strategy & Tech',
    desktop: { fontFamily: 'ABCWhyteInktrap', fontSize: '59.476', fontWeight: '185', lineHeight: '55.759', letterSpacing: '10.706', color: '#F5F2EE' },
    mobile:  { fontFamily: 'ABCWhyteInktrap', fontSize: '24',     fontWeight: '185', lineHeight: '30',     letterSpacing: '4.32',   color: '#F5F2EE' },
  },

  // ── Projetos ────────────────────────────────────────────────
  'projects-label': {
    section: 'Projetos', label: 'Label',
    content: '— Trabalhos selecionados',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
  },
  'projects-heading': {
    section: 'Projetos', label: 'Título',
    content: 'Projetos',
    desktop: { fontFamily: 'Network', fontSize: '104', fontWeight: '400', lineHeight: '93.6', letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: 'Network', fontSize: '48',  fontWeight: '400', lineHeight: '43.2', letterSpacing: '0', color: '#101010' },
  },

  // ── Sobre ───────────────────────────────────────────────────
  'about-label': {
    section: 'Sobre', label: 'Label',
    content: '— Quem sou eu',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
  },
  'about-heading': {
    section: 'Sobre', label: 'Título',
    content: 'Sobre\nMim',
    desktop: { fontFamily: 'Network', fontSize: '96', fontWeight: '400', lineHeight: '86.4', letterSpacing: '0', color: '#EF3537' },
    mobile:  { fontFamily: 'Network', fontSize: '48', fontWeight: '400', lineHeight: '43.2', letterSpacing: '0', color: '#EF3537' },
  },
  'about-bio': {
    section: 'Sobre', label: 'Bio (parágrafo 1)',
    content: 'Sou um líder de Design com mais de 15 anos de carreira, construindo produtos digitais de alto impacto. Meu perfil é um equilíbrio entre liderança humana (soft skills) e profundidade técnica/estratégica (hard skills).',
    desktop: { fontFamily: 'Inter', fontSize: '16', fontWeight: '400', lineHeight: '28', letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: 'Inter', fontSize: '15', fontWeight: '400', lineHeight: '26', letterSpacing: '0', color: '#101010' },
  },
  'about-bio-2': {
    section: 'Sobre', label: 'Bio (parágrafo 2)',
    content: 'Já atuei em grandes empresas como Wine, Itaú e Mercado Livre. No Mercado Pago (fintech do Mercado Livre), liderei times multidisciplinares em projetos de alta complexidade para toda a América Latina, sempre com o pé no negócio e o olho no desenvolvimento das pessoas.',
    desktop: { fontFamily: 'Inter', fontSize: '16', fontWeight: '400', lineHeight: '28', letterSpacing: '0', color: '#666666' },
    mobile:  { fontFamily: 'Inter', fontSize: '15', fontWeight: '400', lineHeight: '26', letterSpacing: '0', color: '#666666' },
  },
  'about-bio-3': {
    section: 'Sobre', label: 'Bio (parágrafo 3)',
    content: '',
    desktop: { fontFamily: 'Inter', fontSize: '16', fontWeight: '400', lineHeight: '28', letterSpacing: '0', color: '#666666' },
    mobile:  { fontFamily: 'Inter', fontSize: '15', fontWeight: '400', lineHeight: '26', letterSpacing: '0', color: '#666666' },
  },

  // ── Skills ──────────────────────────────────────────────────
  'skills-label': {
    section: 'Skills', label: 'Label',
    content: '— Competências',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
  },
  'skills-heading': {
    section: 'Skills', label: 'Título',
    content: 'Core Skills\ne Expertise',
    desktop: { fontFamily: 'Network', fontSize: '88', fontWeight: '400', lineHeight: '79.2', letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: 'Network', fontSize: '40', fontWeight: '400', lineHeight: '36',   letterSpacing: '0', color: '#101010' },
  },

  // ── Impacto ─────────────────────────────────────────────────
  'impact-label': {
    section: 'Impacto', label: 'Label',
    content: '— Resultados reais',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#F5F2EE' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#F5F2EE' },
  },
  'impact-heading': {
    section: 'Impacto', label: 'Título',
    content: 'Impacto e\nReconhecimento',
    desktop: { fontFamily: 'Network', fontSize: '88', fontWeight: '400', lineHeight: '79.2', letterSpacing: '0', color: '#FFFFFF' },
    mobile:  { fontFamily: 'Network', fontSize: '40', fontWeight: '400', lineHeight: '36',   letterSpacing: '0', color: '#FFFFFF' },
  },

  // ── Jornada ─────────────────────────────────────────────────
  'journey-label': {
    section: 'Jornada', label: 'Label',
    content: '— Trajetória profissional',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '12', fontWeight: '700', lineHeight: '12', letterSpacing: '1.2', color: '#EF3537' },
  },
  'journey-heading': {
    section: 'Jornada', label: 'Título',
    content: 'A Jornada',
    desktop: { fontFamily: 'Network', fontSize: '88', fontWeight: '400', lineHeight: '79.2', letterSpacing: '0', color: '#101010' },
    mobile:  { fontFamily: 'Network', fontSize: '40', fontWeight: '400', lineHeight: '36',   letterSpacing: '0', color: '#101010' },
  },

  // ── Contato ─────────────────────────────────────────────────
  'contact-heading': {
    section: 'Contato', label: 'Título CTA',
    content: 'Gostou!?',
    desktop: { fontFamily: 'Network', fontSize: '160', fontWeight: '400', lineHeight: '144', letterSpacing: '0', color: '#FFFFFF' },
    mobile:  { fontFamily: 'Network', fontSize: '64',  fontWeight: '400', lineHeight: '57.6', letterSpacing: '0', color: '#FFFFFF' },
  },
  'contact-subheading': {
    section: 'Contato', label: 'Subtítulo',
    content: 'Entre em contato e vamos conversar',
    desktop: { fontFamily: 'ABCWhyte', fontSize: '20', fontWeight: '400', lineHeight: '28', letterSpacing: '0', color: '#F5F2EE' },
    mobile:  { fontFamily: 'ABCWhyte', fontSize: '16', fontWeight: '400', lineHeight: '24', letterSpacing: '0', color: '#F5F2EE' },
  },
}

const LS_KEY = 'dh_editor_styles'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return structuredClone(DEFAULTS)
    const stored = JSON.parse(raw)
    // Merge stored values over defaults (so new elements added in code appear)
    return Object.fromEntries(
      Object.entries(DEFAULTS).map(([id, def]) => [id, stored[id] ?? structuredClone(def)])
    )
  } catch {
    return structuredClone(DEFAULTS)
  }
}

/* Converts stored props to a React inline style object */
export function toStyleObject(props) {
  const obj = {}
  if (props.fontFamily) obj.fontFamily = `'${props.fontFamily}', sans-serif`
  if (props.fontSize)   obj.fontSize   = `${props.fontSize}px`
  if (props.fontWeight) obj.fontWeight  = Number(props.fontWeight)
  if (props.lineHeight) obj.lineHeight  = `${props.lineHeight}px`
  if (props.letterSpacing !== undefined && props.letterSpacing !== '') obj.letterSpacing = `${props.letterSpacing}px`
  if (props.color)      obj.color       = props.color
  return obj
}

/* Generates the full CSS block for copy-paste */
export function toCSSBlock(id, element) {
  const d = element.desktop
  const m = element.mobile
  const sel = `.${id}`
  return (
`/* ${element.section} · ${element.label} */
${sel} {
  font-family: '${m.fontFamily}', sans-serif;
  font-weight: ${m.fontWeight};
  font-size: ${m.fontSize}px;
  line-height: ${m.lineHeight}px;
  letter-spacing: ${m.letterSpacing}px;
  color: ${m.color};
}
@media (min-width: 768px) {
  ${sel} {
    font-family: '${d.fontFamily}', sans-serif;
    font-weight: ${d.fontWeight};
    font-size: ${d.fontSize}px;
    line-height: ${d.lineHeight}px;
    letter-spacing: ${d.letterSpacing}px;
    color: ${d.color};
  }
}`
  )
}

/* Groups element ids by section */
export function getSections(elements) {
  const map = {}
  for (const [id, el] of Object.entries(elements)) {
    if (!map[el.section]) map[el.section] = []
    map[el.section].push({ id, ...el })
  }
  return map
}

const EditorContext = createContext(null)

export function EditorProvider({ children }) {
  const [editMode,    setEditMode]    = useState(false)
  const [panelOpen,   setPanelOpen]   = useState(false)
  const [elements,    setElements]    = useState(loadFromStorage)
  const [selectedId,  setSelectedId]  = useState('hero-title')

  const openElement = useCallback((id) => {
    setSelectedId(id)
    setPanelOpen(true)
    setEditMode(true)
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setEditMode(false)
  }, [])

  const update = useCallback((id, bp, prop, value) => {
    setElements(prev => ({
      ...prev,
      [id]: { ...prev[id], [bp]: { ...prev[id][bp], [prop]: value } },
    }))
  }, [])

  const updateContent = useCallback((id, value) => {
    setElements(prev => ({ ...prev, [id]: { ...prev[id], content: value } }))
  }, [])

  const save = useCallback(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(elements))
  }, [elements])

  const reset = useCallback((id) => {
    setElements(prev => ({ ...prev, [id]: structuredClone(DEFAULTS[id]) }))
  }, [])

  const resetAll = useCallback(() => {
    setElements(structuredClone(DEFAULTS))
    localStorage.removeItem(LS_KEY)
  }, [])

  return (
    <EditorContext.Provider value={{
      editMode, setEditMode,
      panelOpen, setPanelOpen, closePanel,
      elements, selectedId, setSelectedId,
      openElement, update, updateContent,
      save, reset, resetAll,
      defaults: DEFAULTS,
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => useContext(EditorContext)
