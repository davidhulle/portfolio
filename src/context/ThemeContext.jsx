import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = (e) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    const x = e?.clientX ?? window.innerWidth  / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y),
    )

    /* Expanding ring — visible over unchanged areas like the hero */
    const ring = document.createElement('div')
    ring.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      width: 0; height: 0;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.45);
      transform: translate(-50%, -50%);
      z-index: 2147483647;
      pointer-events: none;
    `
    document.body.appendChild(ring)
    const diameter = endRadius * 2
    ring.animate(
      [
        { width: '0px',         height: '0px',         opacity: 0.7 },
        { width: `${diameter}px`, height: `${diameter}px`, opacity: 0 },
      ],
      { duration: 650, easing: 'ease-out', fill: 'forwards' },
    ).onfinish = () => ring.remove()

    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
      setTheme(newTheme)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration:      600,
          easing:        'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
