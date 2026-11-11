import { getParts, setParts, subscribe, makeId } from './store.js'
import { getStockStatus } from './availability.js'
import { showToast, escapeHtml } from './ui.js'

const STATUS_LABELS = { ok: 'In stock', low: 'Low stock', out: 'Out of stock' }

let parts = getParts()
let catalog = []

const form = document.getElementById('part-form')
const list = document.getElementById('parts-list')
const emptyState = document.getElementById('empty-state')
const searchInput = document.getElementById('search')
const categoryFilter = document.getElementById('filter-category')
const sortSelect = document.getElementById('sort')
const catalogSelect = document.getElementById('catalog-select')
const summary = document.getElementById('summary')
const submitBtn = document.getElementById('submit-btn')
const cancelBtn = document.getElementById('cancel-edit')

export function initInventory(catalogData) {
  catalog = catalogData
  fillCatalogSelect()
  form.addEventListener('submit', handleSubmit)
  cancelBtn.addEventListener('click', resetForm)
  catalogSelect.addEventListener('change', handleCatalogPick)
  searchInput.addEventListener('input', render)
  categoryFilter.addEventListener('change', render)
  sortSelect.addEventListener('change', render)
  list.addEventListener('click', handleListClick) // event delegation
  subscribe((next) => {
    parts = next
    render()
  })
  render()
}

/* ---------- Form ---------- */

function fillCatalogSelect() {
  const options = catalog
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join('')
  catalogSelect.innerHTML = `<option value="">Choose a catalog part...</option>${options}`
}

function handleCatalogPick() {
  const item = catalog.find((c) => c.id === catalogSelect.value)
  if (!item) return
  form.elements.name.value = item.name
  form.elements.category.value = item.category
  form.elements.catalogId.value = item.id
}

function getFormData() {
  const f = form.elements
  return {
    id: f.id.value,
    catalogId: f.catalogId.value,
    name: f.name.value.trim(),
    category: f.category.value.trim(),
    quantity: f.quantity.value,
    minStock: f.minStock.value,
    location: f.location.value.trim(),
  }
}

function validate(data) {
  const errors = {}
  if (!data.name) errors.name = 'Name is required.'
  if (!data.category) errors.category = 'Category is required.'
  const qty = Number(data.quantity)
  if (data.quantity === '' || !Number.isInteger(qty) || qty < 0) {
    errors.quantity = 'Quantity must be a whole number, 0 or more.'
  }
  const min = Number(data.minStock || 0)
  if (!Number.isInteger(min) || min < 0) {
    errors.minStock = 'Low-stock level must be a whole number, 0 or more.'
  }
  return errors
}

function showErrors(errors) {
  form.querySelectorAll('[data-error]').forEach((el) => {
    el.textContent = errors[el.dataset.error] || ''
  })
}

function handleSubmit(event) {
  event.preventDefault()
  const data = getFormData()
  const errors = validate(data)
  showErrors(errors)
  if (Object.keys(errors).length > 0) {
    showToast('Please fix the highlighted fields.', true)
    return
  }

  const part = {
    name: data.name,
    category: data.category,
    quantity: Number(data.quantity),
    minStock: Number(data.minStock || 0),
    location: data.location,
    ...(data.catalogId ? { catalogId: data.catalogId } : {}),
  }

  if (data.id) {
    parts = parts.map((p) => (p.id === data.id ? { ...p, ...part } : p))
    showToast('Part updated.')
  } else {
    parts = [...parts, { id: makeId(), ...part }]
    showToast('Part added.')
  }

  setParts(parts)
  resetForm()
  render()
}

function resetForm() {
  form.reset()
  form.elements.id.value = ''
  form.elements.catalogId.value = ''
  showErrors({})
  submitBtn.textContent = 'Add part'
  cancelBtn.hidden = true
}

function startEdit(id) {
  const part = parts.find((p) => p.id === id)
  if (!part) return
  const f = form.elements
  f.id.value = part.id
  f.catalogId.value = part.catalogId || ''
  f.name.value = part.name
  f.category.value = part.category
  f.quantity.value = part.quantity
  f.minStock.value = part.minStock
  f.location.value = part.location
  submitBtn.textContent = 'Save changes'
  cancelBtn.hidden = false
  form.scrollIntoView({ behavior: 'smooth' })
}

/* ---------- List ---------- */

function handleListClick(event) {
  const btn = event.target.closest('button[data-action]')
  if (!btn) return
  const { action, id } = btn.dataset
  if (action === 'edit') startEdit(id)
  if (action === 'delete' && confirm('Delete this part?')) {
    parts = parts.filter((p) => p.id !== id)
    setParts(parts)
    render()
    showToast('Part deleted.')
  }
}

function updateCategoryFilter() {
  const categories = [...new Set(parts.map((p) => p.category))].sort()
  const current = categoryFilter.value
  categoryFilter.innerHTML =
    '<option value="">All categories</option>' +
    categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')
  categoryFilter.value = categories.includes(current) ? current : ''
}

function getVisibleParts() {
  const term = searchInput.value.trim().toLowerCase()
  const category = categoryFilter.value
  const sorters = {
    name: (a, b) => a.name.localeCompare(b.name),
    quantity: (a, b) => a.quantity - b.quantity,
    category: (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  }
  return parts
    .filter((p) => !category || p.category === category)
    .filter((p) => `${p.name} ${p.category} ${p.location}`.toLowerCase().includes(term))
    .sort(sorters[sortSelect.value])
}

function render() {
  updateCategoryFilter()
  const visible = getVisibleParts()

  list.innerHTML = visible
    .map((p) => {
      const status = getStockStatus(p.quantity, p.minStock)
      return `
        <li class="card part-card">
          <div>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="part-meta">${escapeHtml(p.category)} · Qty ${p.quantity}${p.location ? ' · ' + escapeHtml(p.location) : ''}</p>
            <span class="badge badge-${status}">${STATUS_LABELS[status]}</span>
          </div>
          <div class="part-actions">
            <button class="btn btn-small" data-action="edit" data-id="${p.id}">Edit</button>
            <button class="btn btn-small btn-danger" data-action="delete" data-id="${p.id}">Delete</button>
          </div>
        </li>`
    })
    .join('')

  const lowCount = parts.filter((p) => getStockStatus(p.quantity, p.minStock) !== 'ok').length
  summary.textContent = `${parts.length} part(s) total · ${lowCount} low or out of stock`

  emptyState.hidden = visible.length > 0
  emptyState.textContent =
    parts.length === 0 ? 'No parts yet. Add your first part above.' : 'No parts match your search or filter.'
}
