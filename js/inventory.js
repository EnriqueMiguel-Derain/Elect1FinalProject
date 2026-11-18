import { getParts, setParts, subscribe, makeId } from './store.js'
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
const deliveryDialog = document.getElementById('delivery-dialog')
const deliveryMessage = document.getElementById('delivery-message')
document.getElementById('delivery-close')?.addEventListener('click', () => deliveryDialog.close())

export function initInventory(catalogItems = []) {
  catalog = catalogItems
  searchInput.addEventListener('input', render)
  categoryFilter.addEventListener('change', render)
  sortSelect.addEventListener('change', render)
  list.addEventListener('click', handleListClick)
  subscribe((next) => { parts = next; render() })
  render()
}

export function assemblePCSet(build, catalogItems) {
  if (!build?.partIds?.length) return { ok: false, message: 'This package has no listed components.' }
  const next = [...getParts()]
  const components = []

  for (const catalogId of build.partIds) {
    const item = catalogItems.find((entry) => entry.id === catalogId)
    if (!item) return { ok: false, message: 'A package component is missing from the catalog.' }
    const index = next.findIndex((part) => part.catalogId === catalogId && Number(part.quantity) > 0)
    if (index < 0) return { ok: false, message: `You need ${item.name} before building this set.` }

    const source = next[index]
    const unitPrice = source.purchasePrice ?? item.price
    components.push({
      catalogId,
      name: item.name,
      category: item.category,
      quantity: 1,
      ownership: source.ownership === 'on-hold' ? 'on-hold' : 'owned',
      purchasePrice: Number.isFinite(Number(unitPrice)) ? Number(unitPrice) : null,
      purchasedAt: source.purchasedAt || '',
      location: source.location || '',
    })
    if (source.quantity > 1) next[index] = { ...source, quantity: source.quantity - 1 }
    else next.splice(index, 1)
  }

  const unitPrices = components.map((component) => component.purchasePrice)
  const purchasePrice = unitPrices.every((price) => price != null)
    ? Math.round(unitPrices.reduce((sum, price, index) => sum + price * components[index].quantity, 0) * 100) / 100
    : null
  next.push({
    id: makeId(),
    kind: 'pc-set',
    packageId: build.id,
    name: build.name,
    category: 'PC Build',
    quantity: 1,
    ownership: components.some((component) => component.ownership === 'on-hold') ? 'on-hold' : 'owned',
    purchasePrice,
    components,
    location: '',
    assembledAt: new Date().toISOString(),
  })
  setParts(next)
  return { ok: true }
}

export function assembleCircuitSet(project, lines, catalogItems) {
  const next = [...getParts()]
  const components = []
  for (const line of lines) {
    const item = catalogItems.find((entry) => entry.id === line.id)
    if (!item) return { ok: false, message: 'A project component is missing from the catalog.' }
    const index = next.findIndex((part) => part.catalogId === item.id && Number(part.quantity) >= line.packQuantity)
    if (index < 0) return { ok: false, message: `You need ${line.packQuantity} catalog pack(s) of ${item.name} before building this set.` }
    const source = next[index]
    components.push({ catalogId:item.id, name:item.name, category:item.category, quantity:line.packQuantity, bomQuantity:line.physicalQuantity, bomBreakdown:line.breakdown || [],
      ownership:source.ownership === 'on-hold' ? 'on-hold' : 'owned', purchasePrice:source.purchasePrice ?? item.price,
      purchasedAt:source.purchasedAt || '', location:source.location || '' })
    if (source.quantity > line.packQuantity) next[index] = { ...source, quantity:source.quantity-line.packQuantity }
    else next.splice(index, 1)
  }
  const prices = components.map((part) => part.purchasePrice)
  next.push({ id:makeId(), kind:'circuit-set', packageId:project.id, name:project.name, category:'Circuit Project', quantity:1,
    ownership:components.some((part) => part.ownership === 'on-hold') ? 'on-hold' : 'owned',
    purchasePrice:prices.every((price) => price != null) ? Math.round(prices.reduce((sum, price, i) => sum + Number(price) * components[i].quantity, 0) * 100) / 100 : null,
    components, location:'', assembledAt:new Date().toISOString() })
  setParts(next)
  return { ok:true }
}

export function disassemblePCSet(setId) { return disassembleInventorySet(setId) }

export function disassembleInventorySet(setId) {
  const set = getParts().find((part) => part.id === setId && ['pc-set','circuit-set'].includes(part.kind))
  if (!set?.components?.length) return { ok: false, message: 'This inventory entry is not a complete set.' }

  const next = getParts().filter((part) => part.id !== setId)
  if (set.quantity > 1) next.push({ ...set, quantity: set.quantity - 1 })
  for (const component of set.components) {
    const item = catalog.find((entry) => entry.id === component.catalogId)
    if (!item) return { ok: false, message: `${component.name || 'A component'} is no longer in the catalog.` }
    const quantity = Math.max(1, Number(component.quantity) || 1)
    const ownership = component.ownership === 'on-hold' ? 'on-hold' : 'owned'
    const price = component.purchasePrice ?? item.price
    const existing = next.find((part) => !['pc-set','circuit-set'].includes(part.kind) && part.catalogId === component.catalogId && part.ownership === ownership)

    if (existing) {
      const totalQuantity = Number(existing.quantity) + quantity
      const existingPrice = existing.purchasePrice ?? item.price
      const averagePrice = existingPrice == null || price == null
        ? null
        : Math.round(((Number(existingPrice) * Number(existing.quantity) + Number(price) * quantity) / totalQuantity) * 100) / 100
      const index = next.findIndex((part) => part.id === existing.id)
      next[index] = { ...existing, quantity: totalQuantity, purchasePrice: averagePrice }
    } else {
      next.push({
        id: makeId(), catalogId: component.catalogId, name: component.name || item.name,
        category: component.category || item.category, quantity, ownership,
        purchasePrice: price == null ? null : Number(price), minStock: 0,
        location: component.location || '', purchasedAt: component.purchasedAt || set.purchasedAt || '',
      })
    }
  }
  setParts(next)
  return { ok: true }
}

async function handleListClick(event) {
  const btn = event.target.closest('button[data-action]')
  if (!btn) return
  const { action, id } = btn.dataset
  const part = parts.find((item) => item.id === id)
  const isSet = ['pc-set','circuit-set'].includes(part?.kind)
  if (action === 'details' && part) {
    const item = isSet ? {
      id: part.packageId, name: part.name, category: part.category,
      summary: `A ${part.kind === 'circuit-set' ? 'circuit kit' : 'PC set'} containing ${part.components?.length || 0} catalog component types.`, specs: {}, price: part.purchasePrice,
    } : catalog.find((entry) => entry.id === part.catalogId) || {
      id: part.catalogId, name: part.name, category: part.category, summary: '', specs: {}, price: null,
    }
    const detailPart = isSet ? {
      ...part,
      components: (part.components || []).map((component) => {
        const catalogItem = catalog.find((entry) => entry.id === component.catalogId)
        return {
          ...component,
          sourceUrl: component.sourceUrl || catalogItem?.sourceUrl,
          sourceName: component.sourceName || catalogItem?.sourceName,
          priceCheckedAt: component.priceCheckedAt || catalogItem?.priceCheckedAt,
        }
      }),
    } : part
    showItemDetails(item, detailPart, {
      onComment: (comment) => {
        const nextComments = [...(part.comments || []), { text: comment, createdAt: new Date().toISOString() }]
        parts = parts.map((row) => row.id === id ? { ...row, comments: nextComments } : row)
        setParts(parts)
        return nextComments
      },
    })
  }
  if (action === 'disassemble' && isSet) {
    if (!await confirmInApp({
      title: part.kind === 'circuit-set' ? 'Disassemble circuit set?' : 'Disassemble PC set?',
      message: `Turn one ${part.name} set back into its ${part.components.length} individual parts?`,
      confirmLabel: 'Disassemble set',
    })) return
    const result = disassembleInventorySet(id)
    if (!result.ok) return showToast(result.message, true)
    showToast(`One ${part.name} set was disassembled into individual inventory parts.`)
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
  if (action === 'deliver' && part) {
    if (part.ownership === 'on-hold') return showToast('On-hold items cannot be delivered.', true)
    parts = parts.filter((item) => item.id !== id)
    setParts(parts)
    render()
    deliveryMessage.textContent = `${part.quantity} × ${part.name} has been removed from inventory and marked as delivered.`
    if (!deliveryDialog.open) deliveryDialog.showModal()
  }
}

function inventoryCategory(part) {
  if (['pc-set', 'circuit-set'].includes(part.kind)) return 'Build Sets'
  return catalog.find((item) => item.id === part.catalogId)?.category || part.category
}

function updateCategoryFilter() {
  const categories = [...new Set(parts.map(inventoryCategory))].sort()
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
  return parts.filter((part) => !category || inventoryCategory(part) === category)
    .filter((part) => {
      const item = catalog.find((entry) => entry.id === part.catalogId)
      return `${part.name} ${inventoryCategory(part)} ${item?.subcategory || ''} ${part.location}`.toLowerCase().includes(term)
    })
    .sort((a, b) => sorters[sortSelect.value](
      { ...a, category: inventoryCategory(a) }, { ...b, category: inventoryCategory(b) },
    ))
}

function render() {
  updateCategoryFilter()
  const visible = getVisibleParts()
  list.innerHTML = visible.map((part) => inventoryCard(part, catalog.find((item) => item.id === part.catalogId))).join('')
  const ownedCount = parts.filter((part) => part.ownership !== 'on-hold').length
  const onHoldCount = parts.length - ownedCount
  const lowCount = parts.filter((part) => tracksLowStock(inventoryCategory(part)) && getStockStatus(part.quantity, part.minStock) !== 'ok').length
  summary.textContent = `${parts.length} part type(s) · ${ownedCount} owned · ${onHoldCount} on hold · ${lowCount} electronic part(s) low or out of stock`
  emptyState.hidden = visible.length > 0
  emptyState.textContent = parts.length === 0
    ? 'Your inventory is empty. Visit the Catalog to add parts to this account.'
    : 'No parts match your search or filter.'
}
