import {
  getCurrentAccount, loadAccountCart, saveAccountCart, adjustCurrentBalance,
} from './accounts.js'
import { getParts, setParts, makeId } from './store.js'
import { getSettings } from './settings.js'
import { tracksLowStock } from './availability.js'
import { escapeHtml, formatPrice, showToast } from './ui.js'

let catalog = []
let selectedIds = new Set()
const listeners = []
const $ = (id) => document.getElementById(id)

function announceCartChange() {
  listeners.forEach((listener) => listener())
}

function saveCart(cart) {
  saveAccountCart(cart)
  announceCartChange()
}

export function getCartCount() {
  return loadAccountCart().reduce((sum, entry) => sum + entry.quantity, 0)
}

export function subscribeCart(listener) {
  listeners.push(listener)
}

export function refreshCart() {
  selectedIds.clear()
  announceCartChange()
}

export function addItemsToCart(items) {
  if (!getCurrentAccount()) return false
  const cart = [...loadAccountCart()]
  for (const item of items) {
    if (!item) continue
    const existing = cart.find((entry) => entry.catalogId === item.id)
    if (existing) existing.quantity += 1
    else cart.push({ catalogId: item.id, quantity: 1 })
  }
  saveCart(cart)
  return true
}

export const addToCart = (item) => addItemsToCart([item])

function getCartEntries() {
  const entries = loadAccountCart()
  return entries.map((entry) => ({
    ...entry,
    item: catalog.find((part) => part.id === entry.catalogId),
  })).filter((entry) => entry.item)
}

function updateCartQuantity(catalogId, quantity) {
  const count = Number(quantity)
  if (!Number.isInteger(count) || count < 1) return false
  const cart = loadAccountCart().map((entry) => entry.catalogId === catalogId ? { ...entry, quantity: count } : entry)
  saveCart(cart)
  return true
}

function removeCartItem(catalogId) {
  saveCart(loadAccountCart().filter((entry) => entry.catalogId !== catalogId))
  selectedIds.delete(catalogId)
}

function checkoutSelected(catalogIds) {
  const account = getCurrentAccount()
  if (!account) return { ok: false, message: 'Sign in before checking out.' }
  const selected = getCartEntries().filter((entry) => catalogIds.includes(entry.catalogId))
  if (!selected.length) return { ok: false, message: 'Select at least one item to check out.' }
  if (selected.some(({ item }) => !Number.isFinite(Number(item.price)) || item.price == null || Number(item.price) < 0)) {
    return { ok: false, message: 'Some selected items do not have a catalog price. Unselect them to continue.' }
  }

  const totalCents = selected.reduce((sum, { item, quantity }) => sum + Math.round(Number(item.price) * 100) * quantity, 0)
  const total = totalCents / 100
  if (total > account.balance) {
    return { ok: false, message: `Your balance is short by ${formatPrice(total - account.balance)}. Cash in from your Account page.` }
  }
  if (total > 0 && adjustCurrentBalance(-total) === null) {
    return { ok: false, message: 'Your balance changed. Review the total and try again.' }
  }

  let parts = [...getParts()]
  const purchasedAt = new Date().toISOString()
  for (const { item, quantity } of selected) {
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
  const purchasedIds = new Set(selected.map((entry) => entry.catalogId))
  saveCart(loadAccountCart().filter((entry) => !purchasedIds.has(entry.catalogId)))
  window.dispatchEvent(new Event('pyesa-balance-updated'))
  return { ok: true, total, quantity: selected.reduce((sum, entry) => sum + entry.quantity, 0) }
}

function renderCart() {
  const account = getCurrentAccount()
  $('cart-login-prompt').hidden = Boolean(account)
  $('cart-content').hidden = !account
  if (!account) return

  const entries = getCartEntries()
  const availableIds = new Set(entries.map((entry) => entry.catalogId))
  for (const id of selectedIds) if (!availableIds.has(id)) selectedIds.delete(id)
  entries.forEach((entry) => { if (!selectedIds.has(entry.catalogId)) selectedIds.add(entry.catalogId) })

  $('cart-items').innerHTML = entries.map(({ catalogId, quantity, item }) => `
    <li class="card cart-item">
      <label class="cart-select" aria-label="Select ${escapeHtml(item.name)} for checkout"><input type="checkbox" data-cart-select="${escapeHtml(catalogId)}" ${selectedIds.has(catalogId) ? 'checked' : ''}></label>
      <div class="cart-item-info"><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.category)}</p><strong>${formatPrice(item.price)}</strong></div>
      <label class="cart-quantity">Quantity<input type="number" min="1" step="1" value="${quantity}" data-cart-quantity="${escapeHtml(catalogId)}" aria-label="Quantity for ${escapeHtml(item.name)}"></label>
      <button class="btn btn-secondary btn-small" type="button" data-cart-remove="${escapeHtml(catalogId)}">Remove</button>
    </li>`).join('')
  $('cart-empty').hidden = entries.length > 0
  $('cart-balance').textContent = `Available balance: ${formatPrice(account.balance)}`

  const selected = entries.filter((entry) => selectedIds.has(entry.catalogId))
  const hasUnpriced = selected.some(({ item }) => item.price == null || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)
  const total = selected.reduce((sum, { item, quantity }) => item.price == null ? sum : sum + Math.round(Number(item.price) * 100) * quantity, 0) / 100
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
    showToast(`${result.quantity} item(s) checked out for ${formatPrice(result.total)}.`)
  })
  subscribeCart(renderCart)
  window.addEventListener('pyesa-balance-updated', renderCart)
  renderCart()
}
