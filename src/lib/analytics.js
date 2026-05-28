/**
 * Google Analytics 4 — helper de tagueamento
 *
 * Para ativar:
 * 1. Crie uma propriedade em analytics.google.com
 * 2. Copie o Measurement ID (formato G-XXXXXXXXXX)
 * 3. Substitua 'G-XXXXXXXXXX' abaixo e nos dois lugares em index.html
 */
const GA_ID = 'G-XXXXXXXXXX'

/**
 * Mapa de rotas → títulos de página exibidos no GA.
 * Ao criar uma nova página em src/pages/, adicione a rota aqui.
 */
const PAGE_TITLES = {
  '/':                     'Home | David Hulle',
  '/projeto/mercado-pago': 'Mercado Pago — UX Case Study | David Hulle',
}

/** Dispara um page_view para a rota atual. Chamado automaticamente no App.jsx. */
export function trackPageView(pathname) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path:  pathname,
    page_title: PAGE_TITLES[pathname] ?? document.title,
    send_to:    GA_ID,
  })
}

/** Dispara um evento customizado. */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, { ...params, send_to: GA_ID })
}
