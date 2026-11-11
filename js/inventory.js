import { getParts, setParts, subscribe } from './store.js'
import { getStockStatus, tracksLowStock } from './availability.js'
import { showToast, escapeHtml, confirmInApp } from './ui.js'

const STATUS_LABELS = { ok: 'In stock', low: 'Low stock', out: 'Out of stock' }

let parts = getParts()

const form = document.getElementById('part-form')
const editDialog = document.getElementById('part-edit-dialog')
const list = document.getElementById('parts-list')
const emptyState = document.getElementById('empty-state')
const searchInput = document.getElementById('search')
const categoryFilter = document.getElementById('filter-category')
const sortSelect = document.getElementById('sort')
const minStockField = document.getElementById('min-stock-field')
const summary = document.getElementById('summary')
const cancelBtn = document.getElementById('cancel-edit')

export function initInventory() {
  form.addEventListener('submit', handleSubmit)
  cancelBtn.addEventListener('click', resetForm)
  editDialog.addEventListener('click', (event) => {
    if (event.target === editDialog) editDialog.close()
  })
  form.elements.category.addEventListener('input', updateLowStockField)
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

function updateLowStockField() {
  minStockField.hidden = !tracksLowStock(form.elements.category.value)
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
    ownership: f.ownership.value,
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
  if (tracksLowStock(data.category) && (!Number.isInteger(min) || min < 0)) {
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
    ownership: data.ownership === 'on-hold' ? 'on-hold' : 'owned',
    minStock: tracksLowStock(data.category) ? Number(data.minStock || 0) : 0,
    location: data.location,
    ...(data.catalogId ? { catalogId: data.catalogId } : {}),
  }

  if (!data.id || !parts.some((p) => p.id === data.id)) return showToast('Choose an inventory item to edit.', true)
  parts = parts.map((p) => (p.id === data.id ? { ...p, ...part } : p))
  setParts(parts)
  resetForm()
  showToast('Inventory item updated.')
}

function resetForm() {
  form.reset()
  form.elements.id.value = ''
  form.elements.catalogId.value = ''
  updateLowStockField()
  showErrors({})
  if (editDialog.open) editDialog.close()
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
  f.ownership.value = part.ownership === 'on-hold' ? 'on-hold' : 'owned'
  f.location.value = part.location
  updateLowStockField()
  editDialog.showModal()
}

/* ---------- List ---------- */

async function handleListClick(event) {
  const btn = event.target.closest('button[data-action]')
  if (!btn) return
  const { action, id } = btn.dataset
  if (action === 'edit') startEdit(id)
  if (action === 'delete' && await confirmInApp({
    title: 'Remove inventory item?',
    message: 'This removes the part from your inventory.',
    confirmLabel: 'Remove item',
    danger: true,
  })) {
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
      const ownership = p.ownership === 'on-hold' ? 'on-hold' : 'owned'
      const stockStatus = tracksLowStock(p.category) ? getStockStatus(p.quantity, p.minStock) : ''
      return `
        <li class="card part-card">
          <div>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="part-meta">${escapeHtml(p.category)} · Qty ${p.quantity}${p.location ? ' · ' + escapeHtml(p.location) : ''}</p>
            <span class="badge ${ownership === 'on-hold' ? 'badge-local' : 'badge-ok'}">${ownership === 'on-hold' ? 'On hold' : 'Owned'}</span>
            ${stockStatus ? `<span class="badge badge-${stockStatus}">${STATUS_LABELS[stockStatus]}</span>` : ''}
          </div>
          <div class="part-actions">
            <button class="btn btn-small" data-action="edit" data-id="${p.id}">Edit</button>
            <button class="btn btn-small btn-danger" data-action="delete" data-id="${p.id}">Delete</button>
          </div>
        </li>`
    })
    .join('')

  const ownedCount = parts.filter((p) => p.ownership !== 'on-hold').length
  const onHoldCount = parts.length - ownedCount
  const lowCount = parts.filter((p) => tracksLowStock(p.category) && getStockStatus(p.quantity, p.minStock) !== 'ok').length
  summary.textContent = `${parts.length} part type(s) · ${ownedCount} owned · ${onHoldCount} on hold · ${lowCount} electronic part(s) low or out of stock`

  emptyState.hidden = visible.length > 0
  emptyState.textContent =
    parts.length === 0 ? 'Your inventory is empty. Visit the Catalog to add parts to this account.' : 'No parts match your search or filter.'
}
