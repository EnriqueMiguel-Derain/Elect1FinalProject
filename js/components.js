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

// Inventory keeps the Catalog card layout while replacing its purchase action
// with the account-specific quantity, status, and management controls.
export function inventoryCard(part, item) {
  const stockStatus = tracksLowStock(part.category) ? getStockStatus(part.quantity, part.minStock) : ''
  const purchaseDate = part.purchasedAt ? new Date(part.purchasedAt) : null
  const purchaseLabel = purchaseDate && !Number.isNaN(purchaseDate.valueOf())
    ? purchaseDate.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''
  const held = part.ownership === 'on-hold'
  return `
    <li class="product inventory-product">
      <div class="product-visual ${tone(part.category)}">${icon(part.category, 56)}</div>
      <h3>${escapeHtml(part.name)}</h3>
      <p class="product-cat">${escapeHtml(part.category)}${item?.brand ? ' · ' + escapeHtml(item.brand) : ''}</p>
      ${item?.summary ? `<p class="product-spec">${escapeHtml(item.summary)}</p>` : ''}
      <p class="price${item?.price == null ? ' price-none' : ''}">${item?.price == null ? 'Price not set' : formatPrice(item.price)}</p>
      <div class="inventory-tags"><span class="tag ${held ? 'tag-hold' : 'tag-ok'}">${held ? 'On hold' : 'Owned'} · Qty ${part.quantity}</span>${stockStatus ? `<span class="tag tag-${stockStatus}">${stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}</span>` : ''}</div>
      ${part.location ? `<p class="product-cat inventory-location">Location · ${escapeHtml(part.location)}</p>` : ''}
      ${purchaseLabel ? `<p class="product-cat inventory-purchase">Purchased ${purchaseLabel}</p>` : ''}
      <div class="inventory-actions"><button class="btn btn-small" data-action="edit" data-id="${escapeHtml(part.id)}">Edit</button><button class="btn btn-small btn-danger" data-action="delete" data-id="${escapeHtml(part.id)}">Remove</button></div>
    </li>`
}
