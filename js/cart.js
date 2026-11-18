import {
  getCurrentAccount, loadAccountCart, saveAccountCart, adjustCurrentBalance,
} from './accounts.js'
import { getParts, setParts, makeId } from './store.js'
import { getSettings } from './settings.js'
import { tracksLowStock } from './availability.js'
import { escapeHtml, formatPrice, showToast } from './ui.js'

let catalog = []
let selectedIds = new Set()
let initializedIds = new Set()
const listeners = []
const $ = (id) => document.getElementById(id)

function announceCartChange() {
  listeners.forEach((listener) => listener())
}

function saveCart(cart) {
  saveAccountCart(cart)
  announceCartChange()
}

const cartEntryKey = (entry) => entry.cartId || entry.bundleId || `item-${entry.catalogId}`

function migrateLegacyBundles() {
  if (!getCurrentAccount()) return
  const cart = loadAccountCart()
  const groups = new Map()
  cart.filter((entry) => entry.bundleId && entry.kind !== 'pc-set').forEach((entry) => {
    if (!groups.has(entry.bundleId)) groups.set(entry.bundleId, [])
    groups.get(entry.bundleId).push(entry)
  })
  const consumed = new Set()
  const migrated = []
  for (const [bundleId, entries] of groups) {
    const size = Number(entries[0].bundleSize)
    const quantities = new Set(entries.map((entry) => Number(entry.quantity)))
    const productIds = new Set(entries.map((entry) => entry.catalogId))
    if (size > 0 && entries.length === size && productIds.size === size && quantities.size === 1) {
      entries.forEach((entry) => consumed.add(cartEntryKey(entry)))
      migrated.push({
        cartId: bundleId,
        kind: 'bundle',
        packageId: entries[0].packageId || `legacy-${bundleId}`,
        bundleName: entries[0].bundleName || 'PC Package',
        components: entries.map((entry) => ({ catalogId: entry.catalogId })),
        quantity: Number(entries[0].quantity),
      })
    }
  }
  const next = [...cart.filter((entry) => !consumed.has(cartEntryKey(entry))), ...migrated]
  const normalized = []
  const normalByCatalogId = new Map()
  let mergedRows = false
  for (const entry of next) {
    if (entry.kind === 'bundle' || entry.bundleId || !entry.catalogId) {
      normalized.push(entry)
      continue
    }
    const existing = normalByCatalogId.get(entry.catalogId)
    if (existing) {
      existing.quantity += Number(entry.quantity) || 0
      mergedRows = true
    } else {
      const row = { ...entry, quantity: Number(entry.quantity) || 1 }
      normalByCatalogId.set(entry.catalogId, row)
      normalized.push(row)
    }
  }
  if (migrated.length || mergedRows) {
    saveAccountCart(normalized)
  }
}

export function getCartCount() {
  return loadAccountCart().reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)
}

export function subscribeCart(listener) {
  listeners.push(listener)
}

export function refreshCart() {
  migrateLegacyBundles()
  selectedIds.clear()
  initializedIds.clear()
  announceCartChange()
}

export function addItemsToCart(items) {
  if (!getCurrentAccount()) return false
  migrateLegacyBundles()
  const cart = [...loadAccountCart()]
  for (const item of items) {
    if (!item) continue
    const existing = cart.find((entry) => entry.kind !== 'bundle' && !entry.bundleId && entry.catalogId === item.id)
    if (existing) existing.quantity += 1
    else cart.push({ cartId: `item-${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, catalogId: item.id, quantity: 1 })
  }
  saveCart(cart)
  return true
}

export const addToCart = (item) => addItemsToCart([item])

export function addBundleToCart(items, bundleName, packageId = '') {
  if (!getCurrentAccount() || !items?.length) return false
  migrateLegacyBundles()
  const cart = [...loadAccountCart()]
  const packageKey = packageId || bundleName
  const existing = cart.find((entry) => entry.kind === 'bundle' && (entry.packageId || entry.bundleName) === packageKey)
  if (existing) existing.quantity += 1
  else cart.push({
    cartId: `bundle-${packageKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: 'bundle',
    packageId: packageKey,
    bundleName,
    components: items.map((item) => ({ catalogId: item.id })),
    quantity: 1,
  })
  saveCart(cart)
  return true
}

export function addCircuitBundleToCart(lines, bundleName, packageId = '') {
  if (!getCurrentAccount() || !lines?.length) return false
  migrateLegacyBundles()
  const cart = [...loadAccountCart()]
  const packageKey = `${packageId}:${lines.map((line) => line.catalogId).sort().join(',')}`
  const existing = cart.find((entry) => entry.kind === 'bundle' && entry.packageType === 'circuit' && entry.packageId === packageKey)
  if (existing) existing.quantity += 1
  else cart.push({ cartId: `circuit-${packageId}-${Date.now()}`, kind: 'bundle', packageType: 'circuit', packageId: packageKey, bundleName,
    components: lines.map((line) => ({ catalogId: line.catalogId, quantity: line.packQuantity, bomQuantity: line.physicalQuantity, bomBreakdown: line.breakdown || [] })), quantity: 1 })
  saveCart(cart)
  return true
}

function getBundlePricing(entry) {
  const components = (entry.components || []).map((component) => ({
    ...component,
    item: catalog.find((part) => part.id === component.catalogId),
  }))
  const complete = components.length > 0 && components.every(({ item }) => item && Number.isFinite(Number(item.price)) && item.price != null && Number(item.price) >= 0)
  if (!complete) return { components, complete: false, retailCents: null, bundleCents: null }
  const retailCents = components.reduce((sum, { item, quantity = 1 }) => sum + Math.round(Number(item.price) * 100) * quantity, 0)
  const componentPrices = components.map(({ item }) => Math.round(Number(item.price) * 90))
  const bundleCents = componentPrices.reduce((sum, price, index) => sum + price * (Number(components[index].quantity) || 1), 0)
  return { components, complete, retailCents, bundleCents, componentPrices }
}

function getCartEntries() {
  return loadAccountCart().map((entry) => {
    const cartKey = cartEntryKey(entry)
    if (entry.kind === 'bundle') {
      const pricing = getBundlePricing(entry)
      return {
        ...entry,
        cartKey,
        bundleComponents: pricing.components,
        retailPrice: pricing.retailCents == null ? null : pricing.retailCents / 100,
        item: {
          id: cartKey,
          name: entry.bundleName || 'PC Package',
          category: 'PC package',
          price: pricing.bundleCents == null ? null : pricing.bundleCents / 100,
        },
      }
    }
    return { ...entry, cartKey, item: catalog.find((part) => part.id === entry.catalogId) }
  }).filter((entry) => entry.item)
}

function updateCartQuantity(cartKey, quantity) {
  const count = Number(quantity)
  if (!Number.isInteger(count) || count < 1) return false
  const cart = loadAccountCart().map((entry) => cartEntryKey(entry) === cartKey ? { ...entry, quantity: count } : entry)
  saveCart(cart)
  return true
}

function removeCartItem(cartKey) {
  saveCart(loadAccountCart().filter((entry) => cartEntryKey(entry) !== cartKey))
  selectedIds.delete(cartKey)
}

function checkoutSelected(cartKeys) {
  const account = getCurrentAccount()
  if (!account) return { ok: false, message: 'Sign in before checking out.' }
  const selected = getCartEntries().filter((entry) => cartKeys.includes(entry.cartKey))
  if (!selected.length) return { ok: false, message: 'Select at least one item to check out.' }
  if (selected.some(({ item }) => !Number.isFinite(Number(item.price)) || item.price == null || Number(item.price) < 0)) {
    return { ok: false, message: 'Some selected items do not have a complete, priced catalog package. Unselect them to continue.' }
  }

  const totalCents = selected.reduce((sum, { item, quantity }) => sum + Math.round(Number(item.price) * 100) * quantity, 0)
  const discountCents = selected.filter((entry) => entry.kind === 'bundle').reduce((sum, entry) => {
    const pricing = getBundlePricing(entry)
    return sum + (pricing.retailCents - pricing.bundleCents) * entry.quantity
  }, 0)
  const total = totalCents / 100
  const discount = discountCents / 100
  if (total > account.balance) {
    return { ok: false, message: `Your balance is short by ${formatPrice(total - account.balance)}. Cash in from your Account page.` }
  }
  if (total > 0 && adjustCurrentBalance(-total) === null) {
    return { ok: false, message: 'Your balance changed. Review the total and try again.' }
  }

  let parts = [...getParts()]
  const purchasedAt = new Date().toISOString()
  for (const entry of selected) {
    if (entry.kind === 'bundle') {
      const pricing = getBundlePricing(entry)
      const components = pricing.components.map(({ item, quantity = 1, bomQuantity }, index) => ({
        catalogId: item.id,
        name: item.name,
        category: item.category,
        quantity,
        bomQuantity: Number(bomQuantity) || quantity,
        bomBreakdown: component.bomBreakdown || [],
        ownership: 'owned',
        purchasePrice: pricing.componentPrices[index] / 100,
        purchasedAt,
      }))
      parts.push({
        id: makeId(),
        kind: entry.packageType === 'circuit' ? 'circuit-set' : 'pc-set',
        packageId: entry.packageId || '',
        name: entry.bundleName || 'PC Package',
        category: entry.packageType === 'circuit' ? 'Circuit Project' : 'PC Build',
        quantity: entry.quantity,
        ownership: 'owned',
        purchasePrice: components.reduce((sum, component) => sum + component.purchasePrice * component.quantity, 0),
        components,
        location: '',
        purchasedAt,
      })
      continue
    }

    const { item, quantity } = entry
    const owned = parts.find((part) => part.catalogId === item.id && part.ownership !== 'on-hold')
    if (owned) {
      parts = parts.map((part) => part.id === owned.id
        ? { ...part, quantity: part.quantity + quantity, purchasePrice: Math.round((((part.purchasePrice ?? Number(item.price)) * part.quantity) + Number(item.price) * quantity) / (part.quantity + quantity) * 100) / 100, ownership: 'owned', purchasedAt }
        : part)
    } else {
      parts.push({
        id: makeId(), catalogId: item.id, name: item.name, category: item.category,
        quantity, purchasePrice: Number(item.price), ownership: 'owned', minStock: tracksLowStock(item.category) ? getSettings().minStock : 0,
        location: '', purchasedAt,
      })
    }
  }

  setParts(parts)
  const purchasedKeys = new Set(selected.map((entry) => entry.cartKey))
  saveCart(loadAccountCart().filter((entry) => !purchasedKeys.has(cartEntryKey(entry))))
  window.dispatchEvent(new Event('pyesa-balance-updated'))
  return { ok: true, total, discount, quantity: selected.reduce((sum, entry) => sum + entry.quantity, 0) }
}

function renderCart() {
  const account = getCurrentAccount()
  $('cart-login-prompt').hidden = Boolean(account)
  $('cart-content').hidden = !account
  if (!account) return

  const entries = getCartEntries()
  const availableIds = new Set(entries.map((entry) => entry.cartKey))
  for (const id of initializedIds) {
    if (!availableIds.has(id)) {
      initializedIds.delete(id)
      selectedIds.delete(id)
    }
  }
  entries.forEach((entry) => {
    if (!initializedIds.has(entry.cartKey)) {
      initializedIds.add(entry.cartKey)
      selectedIds.add(entry.cartKey)
    }
  })

  $('cart-items').innerHTML = entries.map((entry) => {
    const { item, quantity, cartKey } = entry
    const packageInfo = entry.kind === 'bundle'
      ? `<p>Complete ${entry.packageType === 'circuit' ? 'circuit kit' : 'PC set'} · ${entry.bundleComponents.length} catalog parts · 10% set discount</p><small class="cart-bundle-components">Includes: ${entry.bundleComponents.map(({ item: component, quantity = 1, bomQuantity, bomBreakdown = [] }) => `${escapeHtml(component?.name || 'Catalog part unavailable')} × ${bomBreakdown.length ? `${bomBreakdown.join(', ')} (${quantity} pack${quantity === 1 ? '' : 's'})` : bomQuantity > 1 ? `${bomQuantity} pcs (${quantity} pack${quantity === 1 ? '' : 's'})` : quantity}`).join(' · ')}</small>`
      : `<p>${escapeHtml(item.category)}</p>`
    return `
    <li class="card cart-item">
      <label class="cart-select" aria-label="Select ${escapeHtml(item.name)} for checkout"><input type="checkbox" data-cart-select="${escapeHtml(cartKey)}" ${selectedIds.has(cartKey) ? 'checked' : ''}></label>
      <div class="cart-item-info"><h2>${escapeHtml(item.name)}</h2>${packageInfo}<strong>${formatPrice(item.price)}</strong></div>
      <label class="cart-quantity">Quantity<input type="number" min="1" step="1" value="${quantity}" data-cart-quantity="${escapeHtml(cartKey)}" aria-label="Quantity for ${escapeHtml(item.name)}"></label>
      <button class="btn btn-secondary btn-small" type="button" data-cart-remove="${escapeHtml(cartKey)}">Remove</button>
    </li>`
  }).join('')
  $('cart-empty').hidden = entries.length > 0
  $('cart-balance').textContent = `Available balance: ${formatPrice(account.balance)}`

  const selected = entries.filter((entry) => selectedIds.has(entry.cartKey))
  const hasUnpriced = selected.some(({ item }) => item.price == null || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)
  const totalCents = selected.reduce((sum, { item, quantity }) => item.price == null ? sum : sum + Math.round(Number(item.price) * 100) * quantity, 0)
  const discountCents = selected.filter((entry) => entry.kind === 'bundle').reduce((sum, entry) => {
    const pricing = getBundlePricing(entry)
    return sum + (pricing.retailCents - pricing.bundleCents) * entry.quantity
  }, 0)
  const total = totalCents / 100
  $('cart-discount').textContent = hasUnpriced ? '—' : `−${formatPrice(discountCents / 100)}`
  $('cart-total').textContent = hasUnpriced ? 'Price needed' : formatPrice(total)
  const error = $('cart-error')
  if (hasUnpriced) {
    error.textContent = 'Selected items need catalog prices before checkout. Unselect them to continue.'
    error.hidden = false
  } else if (selected.length && total > account.balance) {
    error.textContent = `Your balance is short by ${formatPrice(total - account.balance)}. Cash in from your Account page.`
    error.hidden = false
  } else {
    error.textContent = ''
    error.hidden = true
  }
  $('cart-checkout').disabled = !selected.length || hasUnpriced
}

export function initCartPage(catalogData) {
  catalog = catalogData
  migrateLegacyBundles()
  $('cart-items').addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-cart-select]')
    if (checkbox) {
      if (checkbox.checked) selectedIds.add(checkbox.dataset.cartSelect)
      else selectedIds.delete(checkbox.dataset.cartSelect)
      renderCart()
      return
    }
    const quantity = event.target.closest('[data-cart-quantity]')
    if (quantity) {
      if (!updateCartQuantity(quantity.dataset.cartQuantity, quantity.value)) quantity.value = '1'
    }
  })
  $('cart-items').addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-remove]')
    if (button) removeCartItem(button.dataset.cartRemove)
  })
  $('cart-checkout').addEventListener('click', () => {
    const result = checkoutSelected([...selectedIds])
    if (!result.ok) {
      $('cart-error').textContent = result.message
      $('cart-error').hidden = false
      return
    }
    showToast(`${result.quantity} cart item(s) checked out for ${formatPrice(result.total)}${result.discount ? `, including ${formatPrice(result.discount)} set savings` : ''}.`)
  })
  subscribeCart(renderCart)
  window.addEventListener('pyesa-balance-updated', renderCart)
  renderCart()
}
