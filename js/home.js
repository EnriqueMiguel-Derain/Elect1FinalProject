import { getParts, subscribe, addFromCatalog } from './store.js'
import { productCard } from './components.js'
import { setCatalogCategory } from './catalog.js'
import { icon } from './icons.js'
import { showToast } from './ui.js'

const CATEGORIES = [
  { category: 'Microcontroller', label: 'Micro-controllers', tone: 'a' },
  { category: 'Sensor', label: 'Sensors', tone: 'b' },
  { category: 'CPU', label: 'Processors', tone: 'c' },
  { category: 'GPU', label: 'Graphics Cards', tone: 'd' },
]

export function initHome(catalog) {
  const picks = catalog.filter((c) => c.featured).slice(0, 4)
  const picksGrid = document.getElementById('top-picks')

  document.getElementById('category-grid').innerHTML = CATEGORIES.map(
    (c) => `
    <a class="cat-card tone-${c.tone}" href="#catalog" data-category="${c.category}">
      <div><h3>${c.label}</h3><span>Browse ${icon('arrow', 14)}</span></div>
      <div class="cat-icon">${icon(c.category, 44)}</div>
    </a>`
  ).join('')

  const renderPicks = () => (picksGrid.innerHTML = picks.map((p) => productCard(p, getParts())).join(''))
  renderPicks()
  subscribe(renderPicks)

  picksGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-add]')
    if (!btn) return
    const item = catalog.find((c) => c.id === btn.dataset.add)
    addFromCatalog(item)
    showToast(`${item.name} added to inventory.`)
  })

  // Any link with data-category (cards, banner, footer) pre-filters the Catalog page.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]')
    if (link) setCatalogCategory(link.dataset.category)
  })
}
