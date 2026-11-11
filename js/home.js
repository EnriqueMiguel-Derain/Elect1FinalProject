import { getParts, subscribe } from './store.js'
import { addToCart, addItemsToCart } from './cart.js'
import { productCard } from './components.js'
import { setCatalogCategory } from './catalog.js'
import { icon } from './icons.js'
import { showToast, formatPrice, escapeHtml } from './ui.js'
import { showItemDetails } from './item-details.js'

const CATEGORY_LABELS = {
  CPU: 'Processors', GPU: 'Graphics Cards', RAM: 'Memory',
  Microcontroller: 'Microcontrollers', Sensor: 'Sensors',
}

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
  const categoryCounts = catalog.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1
    return counts
  }, {})

  document.getElementById('hero-count').textContent = catalog.length

  const mostAbundant = Object.entries(categoryCounts)
    .sort(([categoryA, countA], [categoryB, countB]) => countB - countA || categoryA.localeCompare(categoryB))
    .slice(0, 6)
  document.getElementById('category-grid').innerHTML = mostAbundant.map(
    ([category, count]) => `
    <a class="tile" href="#catalog" data-category="${escapeHtml(category)}">
      <span class="tile-icon">${icon(category, 96)}</span>
      <h3>${escapeHtml(CATEGORY_LABELS[category] || category)}</h3>
      <small>${count} part(s)</small>
    </a>`
  ).join('')

  const renderPicks = () => (picksGrid.innerHTML = picks.map((p) => productCard(p, getParts())).join(''))
  renderPicks()
  subscribe(renderPicks)

  picksGrid.addEventListener('click', (event) => {
    const details = event.target.closest('[data-details]')
    if (details) {
      const item = byId(details.dataset.details)
      if (item) showItemDetails(item, null, { onAdd: () => {
        if (!addToCart(item)) {
          showToast('Sign in to add items to your cart.')
          location.hash = '#account'
          return
        }
        showToast(`${item.name} added to your cart.`)
      } })
      return
    }
    const btn = event.target.closest('[data-add]')
    if (!btn) return
    const item = byId(btn.dataset.add)
    if (!addToCart(item)) {
      showToast('Sign in to add items to your cart.')
      location.hash = '#account'
      return
    }
    showToast(`${item.name} added to your cart.`)
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
      <div class="preset-foot"><button class="btn btn-block" data-preset="${i}">Add build to cart</button></div>
    </article>`
  }).join('')

  presetsEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-preset]')
    if (!btn) return
    const items = PRESETS[btn.dataset.preset].ids.map(byId).filter(Boolean)
    if (!addItemsToCart(items)) {
      showToast('Sign in to add a build to your cart.')
      location.hash = '#account'
      return
    }
    showToast(`${items.length} build part(s) added to your cart.`)
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
    }), { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
    reveals.forEach((el) => io.observe(el))
  } else reveals.forEach((el) => el.classList.add('in'))
}
