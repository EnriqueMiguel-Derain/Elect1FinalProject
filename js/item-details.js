import { escapeHtml, formatPrice } from './ui.js'
import { getStockStatus, tracksLowStock } from './availability.js'

import { productVisual } from './components.js'

const dialog = document.getElementById('item-details-dialog')
const title = document.getElementById('item-details-title')
const body = document.getElementById('item-details-body')
const actions = document.getElementById('item-details-actions')
dialog.querySelector('[data-detail-close]')?.addEventListener('click', () => dialog.close())

export function showItemDetails(item, inventoryPart = null, { onAdd, onComment } = {}) {
  if (!item || !dialog) return
  title.textContent = item.name
  const specs = Object.entries(item.specs || {}).filter(([, value]) => value != null && value !== '')
  const specRows = specs.map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
    const text = Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)
    return `<div class="detail-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(text)}</dd></div>`
  }).join('')
  const setComponents = ['pc-set','circuit-set'].includes(inventoryPart?.kind) ? `
    <div class="detail-row"><dt>Included parts</dt><dd><ul class="set-component-list">${(inventoryPart.components || []).map((component) => `<li>${escapeHtml(component.name)} · ${escapeHtml(component.category)}${component.quantity > 1 ? ` × ${component.quantity} catalog packs` : ''}${inventoryPart.kind === 'circuit-set' && component.bomQuantity ? ` · BOM: ${component.bomBreakdown?.length ? component.bomBreakdown.map(escapeHtml).join(', ') : `${component.bomQuantity} pcs`}` : ''}${component.purchasePrice != null ? ` · ${formatPrice(component.purchasePrice)} per pack` : ''}${component.sourceUrl ? ` · <a href="${escapeHtml(component.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(component.sourceName || 'Price reference')} · open listing ↗</a>${component.priceCheckedAt ? ` <small>(checked ${escapeHtml(component.priceCheckedAt)})</small>` : ''}` : ''}</li>`).join('')}</ul></dd></div>` : ''
  const inventoryRows = inventoryPart ? `
    <div class="detail-row"><dt>Inventory status</dt><dd>${inventoryPart.ownership === 'on-hold' ? 'On hold' : 'Owned'}</dd></div>
    <div class="detail-row"><dt>Quantity</dt><dd>${inventoryPart.quantity}</dd></div>
    ${inventoryPart.location ? `<div class="detail-row"><dt>Location</dt><dd>${escapeHtml(inventoryPart.location)}</dd></div>` : ''}
    ${tracksLowStock(inventoryPart.category) ? `<div class="detail-row"><dt>Restock threshold</dt><dd>${inventoryPart.minStock ?? 0}</dd></div><div class="detail-row"><dt>Stock status</dt><dd>${stockLabel(inventoryPart)}</dd></div>` : ''}
    ${inventoryPart.purchasedAt ? `<div class="detail-row"><dt>Purchased</dt><dd>${escapeHtml(new Date(inventoryPart.purchasedAt).toLocaleString('en-PH'))}</dd></div>` : ''}
    ${inventoryPart.assembledAt ? `<div class="detail-row"><dt>Assembled</dt><dd>${escapeHtml(new Date(inventoryPart.assembledAt).toLocaleString('en-PH'))}</dd></div>` : ''}` : ''
  body.innerHTML = `
    <div class="detail-summary"><p class="detail-category">${escapeHtml(item.subcategory || item.category)} · ${escapeHtml(item.category)}${item.brand ? ` · ${escapeHtml(item.brand)}` : ''}</p>
      ${item.image ? productVisual(item, 96) : ''}
      <p class="detail-price${(inventoryPart?.purchasePrice ?? item.price) == null ? ' price-none' : ''}">${formatPrice(inventoryPart?.purchasePrice ?? item.price)}</p>
      ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}
    </div>
    <dl class="detail-list">
      ${item.year ? `<div class="detail-row"><dt>Model year</dt><dd>${escapeHtml(item.year)}</dd></div>` : ''}
      ${item.sourceUrl ? `<div class="detail-row"><dt>Price reference</dt><dd>${escapeHtml(item.sourceName || 'Retailer listing')}${item.priceCheckedAt ? ` · checked ${escapeHtml(item.priceCheckedAt)}` : ''}${item.priceNote ? ` · ${escapeHtml(item.priceNote)}` : ''} · <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open listing ↗</a></dd></div>` : ''}
      ${inventoryRows}${setComponents}${specRows}
      ${!specs.length && !inventoryPart && !item.year ? '<p class="detail-empty">No additional specifications are listed yet.</p>' : ''}
    </dl>
    ${inventoryPart ? `<section class="detail-comments"><h3>Comments</h3><ul id="item-comments-list" class="item-comments">${(inventoryPart.comments || []).map(commentRow).join('') || '<li class="detail-empty">No comments yet.</li>'}</ul><form id="item-comment-form" class="comment-form"><label for="item-comment-input">Add a comment</label><textarea id="item-comment-input" name="comment" rows="3" maxlength="500" placeholder="Add a note about this item..."></textarea><button type="submit" class="btn btn-small">Save comment</button></form></section>` : ''}`
  actions.innerHTML = `${inventoryPart ? '' : onAdd ? '<button type="button" class="btn" data-detail-add>Add to cart</button>' : ''}`
  actions.querySelector('[data-detail-add]')?.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    onAdd?.()
  })
  body.querySelector('#item-comment-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = body.querySelector('#item-comment-input')
    const text = input.value.trim()
    if (!text) return
    const next = onComment?.(text) || [...(inventoryPart.comments || []), { text, createdAt: new Date().toISOString() }]
    inventoryPart = { ...inventoryPart, comments: next }
    body.querySelector('#item-comments-list').innerHTML = next.map(commentRow).join('')
    input.value = ''
  })
  if (!dialog.open) dialog.show()
}

function commentRow(comment) {
  const date = comment.createdAt ? new Date(comment.createdAt) : null
  const stamp = date && !Number.isNaN(date.valueOf()) ? date.toLocaleString('en-PH') : ''
  return `<li><p>${escapeHtml(comment.text)}</p>${stamp ? `<small>${escapeHtml(stamp)}</small>` : ''}</li>`
}

function stockLabel(part) {
  const status = getStockStatus(part.quantity, part.minStock)
  return status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock'
}
