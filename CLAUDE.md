# Portfolio 2026 — Regras para o Claude

## i18n obrigatório em 3 idiomas

Este projeto tem suporte a PT / EN / ES via `src/i18n/translations.js` + `src/context/LangContext.jsx`.

**Toda vez que um texto visível ao usuário for adicionado ou alterado em qualquer componente**, você deve, obrigatoriamente e na mesma resposta:

1. **Adicionar as 3 versões** (PT, EN, ES) em `src/i18n/translations.js` sob uma chave descritiva (`'secao.elemento'`).
2. **Conectar o componente** ao `useLang()` caso ainda não esteja: `import { useLang } from '../context/LangContext'` e `const { t } = useLang()` dentro do componente.
3. **Substituir o texto hardcoded** por `{t('chave')}` no JSX.
4. Para arrays de dados com texto (`const ITEMS = [...]`), renomear para `ITEMS_BASE` com `labelKey`/`descKey` em vez de strings diretas, e derivar o array traduzido dentro do componente com `.map(i => ({ ...i, label: t(i.labelKey) }))`.

### Critérios de tradução

- Termos técnicos de mercado permanecem em inglês nos 3 idiomas: UX/UI, Design System, Fintech, E-commerce, Leadership, Product Design, workflow, time-to-market, soft skills, hard skills, C-level, NPS, Onboarding, craft, cross-border, early adopter.
- Nomes de marcas e organizações permanecem inalterados.
- Job titles (UX Design Lead, Product Designer, etc.) permanecem em inglês.
- Gramática natural de cada idioma — não use tradução muito formal nem muito informal.
- Nunca use `Google Translate` estilo literal; adapte com naturalidade ao mercado de cada idioma.

### Arquitetura do sistema i18n

```
src/i18n/translations.js      ← fonte única de verdade (PT | EN | ES)
src/context/LangContext.jsx   ← provê { lang, setLang, t() } via React context
src/hooks/useTextStyle.js     ← headings de seção também usam t() via contentKey
```

- `LangProvider` envolve o app em `App.jsx` (acima de `ThemeProvider`).
- Detecção automática via `navigator.language` na primeira visita; persiste em `localStorage`.
- `t(key)` retorna PT como fallback se a chave não existir no idioma atual.

### Exemplo de adição correta

```js
// translations.js — adicionar nas 3 seções
'novo.elemento': 'Texto em português',   // PT
'novo.elemento': 'Text in English',      // EN
'novo.elemento': 'Texto en español',     // ES

// componente
import { useLang } from '../context/LangContext'
const { t } = useLang()
// JSX
<p>{t('novo.elemento')}</p>
```

---

## Acessibilidade WCAG 2.1 AA — obrigatório em toda modificação

**Toda adição ou modificação de componente, página ou elemento interativo deve respeitar os critérios abaixo.** Não entregar código que viole estes pontos.

### 1. Contraste de cores
- Texto normal (< 18px regular / < 14px bold): ratio mínimo **4.5:1**.
- Texto grande (≥ 18px regular ou ≥ 14px bold): ratio mínimo **3:1**.
- Componentes de UI (bordas de input, ícones ativos): mínimo **3:1**.
- Nunca usar `opacity` baixa em texto sem verificar o ratio resultante.
- Referência rápida aprovada neste projeto:
  - `#666` sobre `#fff` → 5.74:1 ✓ | `#999` sobre `#0A0A0A` → 4.4:1 ✓
  - `rgba(255,255,255,0.65)` sobre fundo escuro → ~4.8:1 ✓

### 2. Imagens
- **Decorativas** (background, ornamento, ilustração sem info): `alt=""` + `aria-hidden="true"`.
- **Informativas** (logo de empresa, foto de pessoa, ícone com significado): `alt` descritivo obrigatório (ex: `alt="Mercado Pago"`).
- Nunca omitir o atributo `alt`.

### 3. Elementos interativos
- Todo `<button>` e `<a>` sem texto visível precisa de `aria-label` descritivo.
- Links com texto visível que não descreve o destino precisam de `aria-label` complementar (ex: `aria-label="LinkedIn: /in/davidhulle"`).
- Botões de navegação de carousel/slider: `aria-label` obrigatório (`aria-label={t('...')}`).
- Dots/indicadores de posição: `aria-label` + `aria-current="true"` no ativo.
- Usar as chaves i18n existentes (`recs.prev`, `recs.next`, `projects.aria.prev`, etc.).

### 4. Hierarquia de headings
- Não saltar níveis: `h1 → h2 → h3`. Nunca `h1 → h3`.
- Cada página deve ter exatamente **um `<h1>`** (ou `role="heading" aria-level="1"`).
- Seções usam `<h2>`, sub-itens usam `<h3>`.

### 5. Semântica HTML
- Usar elementos nativos: `<button>` para ações, `<a href>` para navegação, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Nunca criar `<div onClick>` clicável sem `role="button"` + `tabIndex={0}` + handlers de teclado (`onKeyDown` para Enter/Space).

### 6. Tamanho de fonte
- Mínimo **12px** para qualquer texto de conteúdo ou label.
- Texto puramente decorativo (ex: "SCROLL") pode ser menor, mas preferir ≥ 10px.

### 7. Motion / animações
- O arquivo `src/index.css` já tem `@media (prefers-reduced-motion: reduce)` que desativa animações CSS globalmente.
- Para animações Framer Motion, verificar `window.matchMedia('(prefers-reduced-motion: reduce)').matches` e reduzir/eliminar `transition` quando `true`.
- Nunca criar loops de animação infinita sem respeitar esta preferência.

### 8. Foco visível
- Nunca usar `outline: none` ou `outline: 0` sem substituir por `:focus-visible` com indicador alternativo (ex: `box-shadow`, `border`).
- Botões e links devem ser navegáveis por teclado na ordem lógica do DOM.

### Checklist rápido antes de entregar qualquer componente
- [ ] Contraste de todas as cores de texto verificado
- [ ] Todas as imagens têm `alt` correto (descritivo ou `""` + `aria-hidden`)
- [ ] Botões/links sem texto visível têm `aria-label`
- [ ] Fontes ≥ 12px em conteúdo
- [ ] Nenhum `outline: none` sem substituto
- [ ] Animações respeitam `prefers-reduced-motion`
