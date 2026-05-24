import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar   from '../components/Navbar'
import Hero     from '../components/Hero'
import Projects from '../components/Projects'
import About    from '../components/About'
import Skills   from '../components/Skills'
import Recommendations from '../components/Recommendations'
import Journey  from '../components/Journey'
import Contact  from '../components/Contact'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const anchor = location.state?.anchor
    if (!anchor) return
    const timer = setTimeout(() => {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }, 120)
    return () => clearTimeout(timer)
  }, [location.state])

  return (
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
  )
}
