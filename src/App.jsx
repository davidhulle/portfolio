import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider }  from './context/LangContext'
import Navbar  from './components/Navbar'
import Hero    from './components/Hero'
import Projects from './components/Projects'
import About   from './components/About'
import Skills          from './components/Skills'
import Recommendations  from './components/Recommendations'
import Journey from './components/Journey'
import Contact from './components/Contact'

function ScrollToTop() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return null
}

export default function App() {
  return (
    <LangProvider>
    <ThemeProvider>
      <ScrollToTop />
      <div className="min-h-svh w-full">
        <Navbar />
        <main>
          <Hero />
          <Projects />
          <About />
          <Skills />
          <Recommendations />
          <Journey />
        </main>
        <Contact />
      </div>
    </ThemeProvider>
    </LangProvider>
  )
}
