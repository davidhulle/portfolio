import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Component } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider }  from './context/LangContext'
import Home                from './pages/Home'
import ProjetoMercadoPago  from './pages/ProjetoMercadoPago'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#fff', color: '#c00' }}>
          <h2>Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projeto/mercado-pago" element={<ProjetoMercadoPago />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LangProvider>
    </ErrorBoundary>
  )
}
