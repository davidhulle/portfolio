import { useEffect, useState } from 'react'
import { useEditor, toStyleObject } from '../context/EditorContext'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

export function useEditorStyle(id) {
  const { elements, editMode, openElement } = useEditor()
  const isMobile = useIsMobile()
  const el = elements[id]

  if (!el) return { style: {}, content: '', handlers: {} }

  const bp      = isMobile ? 'mobile' : 'desktop'
  const style   = toStyleObject(el[bp])
  const content = el.content

  /* handlers are spread onto the element — style kept separate so they don't conflict */
  const handlers = editMode
    ? { 'data-editable': id, onClick: (e) => { e.stopPropagation(); openElement(id) } }
    : {}

  return { style, content, handlers }
}
