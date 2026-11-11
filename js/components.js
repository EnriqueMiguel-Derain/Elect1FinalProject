import { icon } from './icons.js'
import { escapeHtml, formatPrice } from './ui.js'
import { getStockStatus } from './availability.js'

const tone = (category) => 'tone-' + 'abcd'[[...category].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 4]

// Product card shared by the Home "Top Picks" and the Catalog page.
export function productCard(item, parts) {
  const owned = parts.find((p) => p.catalogId === item.id)
  let tag = ''
  if (owned) {
    const status = getStockStatus(owned.quantity, owned.minStock)
    tag = `<span class="tag tag-${status}">Owned: ${owned.quantity}</span>`
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
      <button class="btn btn-block" data-add="${item.id}">+ Add to Inventory</button>
    </article>`
}
