import { getParts, setParts, subscribe } from './store.js'
import { getStockStatus, tracksLowStock } from './availability.js'
import { showToast, escapeHtml, confirmInApp, formatPrice } from './ui.js'
import { inventoryCard } from './components.js'
import { showItemDetails } from './item-details.js'
import { adjustCurrentBalance } from './accounts.js'

let parts = getParts()
let catalog = []
const list = document.getElementById('parts-list')
const emptyState = document.getElementById('empty-state')
const searchInput = document.getElementById('search')
const categoryFilter = document.getElementById('filter-category')
const sortSelect = document.getElementById('sort')
const summary = document.getElementById('summary')

export function initInventory(catalogItems = []) {
  catalog = catalogItems
  searchInput.addEventListener('input', render)
  categoryFilter.addEventListener('change', render)
  sortSelect.addEventListener('change', render)
  list.addEventListener('click', handleListClick)
  subscribe((next) => { parts = next; render() })
  render()
}

async function handleListClick(event) {
  const btn = event.target.closest('button[data-action]')
  if (!btn) return
  const { action, id } = btn.dataset
  const part = parts.find((item) => item.id === id)
  if (action === 'details' && part) {
    const item = catalog.find((entry) => entry.id === part.catalogId) || {
      id: part.catalogId, name: part.name, category: part.category, summary: '', specs: {}, price: null,
    }
    showItemDetails(item, part, {
      onComment: (comment) => {
        const nextComments = [...(part.comments || []), { text: comment, createdAt: new Date().toISOString() }]
        parts = parts.map((row) => row.id === id ? { ...row, comments: nextComments } : row)
        setParts(parts)
        return nextComments
      },
    })
  }
  if (action === 'return' && part) {
    const item = catalog.find((entry) => entry.id === part.catalogId)
    if (part.ownership === 'on-hold') return showToast('On-hold items have not been purchased and cannot be returned.', true)
    const unitPrice = part.purchasePrice ?? item?.price
    if (!Number.isFinite(Number(unitPrice)) || unitPrice == null || Number(unitPrice) < 0) return showToast('This item has no price to refund.', true)
    const refund = Math.round(Number(unitPrice) * 100) * part.quantity / 100
    if (!await confirmInApp({
      title: 'Return item?',
      message: `Return ${part.quantity} × ${part.name} and credit ${formatPrice(refund)} back to your balance?`,
      confirmLabel: 'Return item',
    })) return
    if (refund > 0 && adjustCurrentBalance(refund) === null) return showToast('Sign in to return this item to your balance.', true)
    parts = parts.filter((item) => item.id !== id)
    setParts(parts)
    window.dispatchEvent(new Event('pyesa-balance-updated'))
    render()
    showToast(`Item returned. ${formatPrice(refund)} added to your balance.`)
  }
}

function updateCategoryFilter() {
  const categories = [...new Set(parts.map((part) => part.category))].sort()
  const current = categoryFilter.value
  categoryFilter.innerHTML = '<option value="">All categories</option>' +
    categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('')
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
  return parts.filter((part) => !category || part.category === category)
    .filter((part) => `${part.name} ${part.category} ${part.location}`.toLowerCase().includes(term))
    .sort(sorters[sortSelect.value])
}

function render() {
  updateCategoryFilter()
  const visible = getVisibleParts()
  list.innerHTML = visible.map((part) => inventoryCard(part, catalog.find((item) => item.id === part.catalogId))).join('')
  const ownedCount = parts.filter((part) => part.ownership !== 'on-hold').length
  const onHoldCount = parts.length - ownedCount
  const lowCount = parts.filter((part) => tracksLowStock(part.category) && getStockStatus(part.quantity, part.minStock) !== 'ok').length
  summary.textContent = `${parts.length} part type(s) · ${ownedCount} owned · ${onHoldCount} on hold · ${lowCount} electronic part(s) low or out of stock`
  emptyState.hidden = visible.length > 0
  emptyState.textContent = parts.length === 0
    ? 'Your inventory is empty. Visit the Catalog to add parts to this account.'
    : 'No parts match your search or filter.'
}
