import { createContext, useContext, useEffect, useState } from 'react'
import translations from '../i18n/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang')
    if (stored && ['PT', 'EN', 'ES'].includes(stored)) return stored
    const bl = navigator.language?.toLowerCase() ?? ''
    if (bl.startsWith('pt')) return 'PT'
    if (bl.startsWith('es')) return 'ES'
    return 'EN'
  })

  useEffect(() => { localStorage.setItem('lang', lang) }, [lang])

  const t = (key) =>
    translations[lang]?.[key] ?? translations.PT[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
