import { getParts, subscribe, addFromCatalog } from './store.js'
import { productCard } from './components.js'
import { escapeHtml, showToast } from './ui.js'

let catalog = []
const grid = document.getElementById('catalog-grid')
const search = document.getElementById('catalog-search')
const categorySelect = document.getElementById('catalog-category')
const sortSelect = document.getElementById('catalog-sort')
const empty = document.getElementById('catalog-empty')
const count = document.getElementById('catalog-count')

export function initCatalog(data) {
  catalog = data
  const categories = [...new Set(catalog.map((c) => c.category))].sort()
  categorySelect.innerHTML =
    '<option value="">All categories</option>' +
    categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')
  search.addEventListener('input', render)
  categorySelect.addEventListener('change', render)
  sortSelect.addEventListener('change', render)
  grid.addEventListener('click', handleAdd)
  subscribe(render)
  render()
}

export function setCatalogCategory(category) {
  categorySelect.value = category
  search.value = ''
  render()
}

export function handleAdd(event) {
  const btn = event.target.closest('[data-add]')
  if (!btn) return
  const item = catalog.find((c) => c.id === btn.dataset.add)
  addFromCatalog(item)
  showToast(`${item.name} added to inventory.`)
}

function render() {
  const term = search.value.trim().toLowerCase()
  const sorters = {
    name: (a, b) => a.name.localeCompare(b.name),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  }
  const visible = catalog
    .filter((c) => !categorySelect.value || c.category === categorySelect.value)
    .filter((c) => `${c.name} ${c.category}`.toLowerCase().includes(term))
    .sort(sorters[sortSelect.value])
  const parts = getParts()
  grid.innerHTML = visible.map((c) => productCard(c, parts)).join('')
  empty.hidden = visible.length > 0
  count.textContent = `${visible.length} part(s)`
}
