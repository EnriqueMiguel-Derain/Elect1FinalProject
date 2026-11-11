import { icon } from './icons.js'
import { escapeHtml, formatPrice } from './ui.js'
import { getStockStatus, tracksLowStock } from './availability.js'

const tone = (category) => 'tone-' + 'abcd'[[...category].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 4]

// Product card shared by the Home "Top Picks" and the Catalog page.
export function productCard(item, parts) {
  const matching = parts.filter((p) => p.catalogId === item.id)
  const ownedParts = matching.filter((p) => p.ownership !== 'on-hold')
  const heldParts = matching.filter((p) => p.ownership === 'on-hold')
  const ownedQuantity = ownedParts.reduce((sum, part) => sum + part.quantity, 0)
  const heldQuantity = heldParts.reduce((sum, part) => sum + part.quantity, 0)
  let tag = ''
  if (matching.length) {
    const ownership = [
      ownedQuantity ? `Owned: ${ownedQuantity}` : '',
      heldQuantity ? `On hold: ${heldQuantity}` : '',
    ].filter(Boolean).join(' · ')
    if (tracksLowStock(item.category)) {
      const threshold = ownedParts[0]?.minStock ?? matching[0].minStock ?? 0
      const status = getStockStatus(ownedQuantity, threshold)
      const stockLabel = status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock'
      tag = `<span class="tag tag-${ownedQuantity ? status : 'hold'}">${ownership} · ${stockLabel}</span>`
    } else tag = `<span class="tag ${ownedQuantity ? 'tag-ok' : 'tag-hold'}">${ownership}</span>`
  } else if (item.badge) {
    tag = `<span class="tag tag-${item.badge.toLowerCase()}">${escapeHtml(item.badge)}</span>`
  }
  return `
    <article class="product">
      ${tag}
      <div class="product-visual ${tone(item.category)}">${icon(item.category, 56)}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <p class="product-cat">${escapeHtml(item.category)}${item.brand ? ' · ' + escapeHtml(item.brand) : ''}</p>
      ${item.summary ? `<p class="product-spec">${escapeHtml(item.summary)}</p>` : ''}
      <p class="price${item.price == null ? ' price-none' : ''}">${formatPrice(item.price)}</p>
      <button class="btn btn-block" data-add="${item.id}">+ Add to cart</button>
    </article>`
}
