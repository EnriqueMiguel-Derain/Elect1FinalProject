import { getParts, subscribe, addFromCatalog } from './store.js'
import { productCard } from './components.js'
import { setCatalogCategory } from './catalog.js'
import { icon } from './icons.js'
import { showToast, formatPrice, escapeHtml } from './ui.js'

const TILES = [
  { category: 'Microcontroller', label: 'Microcontrollers' },
  { category: 'Sensor', label: 'Sensors' },
  { category: 'CPU', label: 'Processors' },
  { category: 'GPU', label: 'Graphics Cards' },
  { category: 'RAM', label: 'Memory' },
  { category: 'Storage', label: 'Storage' },
]

// Ready builds are priced from the catalog so they never drift out of date.
const PRESETS = [
  { name: 'Essentials', note: 'Office and light work', ids: ['cpu-r5-7600', 'mb-b650m', 'ram-ddr5-16', 'ssd-1tb', 'psu-550', 'case-matx'] },
  { name: 'Gamer', note: 'Essentials + graphics', ids: ['cpu-r5-7600', 'mb-b650m', 'ram-ddr5-16', 'gpu-rtx4060', 'ssd-1tb', 'psu-550', 'case-matx'], featured: true },
  { name: 'Full Setup', note: 'Gamer + peripherals', ids: ['cpu-r5-7600', 'mb-b650m', 'ram-ddr5-16', 'gpu-rtx4060', 'ssd-1tb', 'psu-550', 'case-matx', 'mon-24', 'kb-mech', 'ms-gaming'] },
]

export function initHome(catalog) {
  const byId = (id) => catalog.find((c) => c.id === id)
  const picks = catalog.filter((c) => c.featured).slice(0, 8)
  const picksGrid = document.getElementById('top-picks')
  const countOf = (cat) => catalog.filter((c) => c.category === cat).length

  document.getElementById('hero-count').textContent = catalog.length

  document.getElementById('category-grid').innerHTML = TILES.map(
    (t) => `
    <a class="tile" href="#catalog" data-category="${t.category}">
      <span class="tile-icon">${icon(t.category, 96)}</span>
      <h3>${t.label}</h3>
      <small>${countOf(t.category)} part(s)</small>
    </a>`
  ).join('')

  const renderPicks = () => (picksGrid.innerHTML = picks.map((p) => productCard(p, getParts())).join(''))
  renderPicks()
  subscribe(renderPicks)

  picksGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-add]')
    if (!btn) return
    const item = byId(btn.dataset.add)
    addFromCatalog(item)
    showToast(`${item.name} added to inventory.`)
  })

  // Ready builds
  const presetsEl = document.getElementById('presets')
  presetsEl.innerHTML = PRESETS.map((p, i) => {
    const items = p.ids.map(byId).filter(Boolean)
    const total = items.reduce((sum, c) => sum + c.price, 0)
    return `
    <article class="preset reveal${p.featured ? ' featured' : ''}" style="transition-delay:${i * 90}ms">
      <div class="preset-head">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="preset-price">${formatPrice(total)}<small>${escapeHtml(p.note)}</small></div>
      </div>
      <ul>${items.map((c) => `<li>${escapeHtml(c.name)}</li>`).join('')}</ul>
      <div class="preset-foot"><button class="btn btn-block" data-preset="${i}">Add build to inventory</button></div>
    </article>`
  }).join('')

  presetsEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-preset]')
    if (!btn) return
    const items = PRESETS[btn.dataset.preset].ids.map(byId).filter(Boolean)
    items.forEach(addFromCatalog)
    showToast(`${items.length} parts added to inventory.`)
  })

  // Any link with data-category (tiles, banner, footer) pre-filters the Catalog page.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]')
    if (link) setCatalogCategory(link.dataset.category)
  })

  // Gentle scroll reveal (respects reduced motion via CSS).
  const reveals = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.15 })
    reveals.forEach((el) => io.observe(el))
  } else reveals.forEach((el) => el.classList.add('in'))
}
