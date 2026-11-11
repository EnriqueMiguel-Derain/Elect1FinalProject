import { getParts, subscribe } from './store.js'
import { getStockStatus } from './availability.js'
import { loadProfile, saveProfile, clearProfile } from './profile.js'
import { showToast, escapeHtml, formatPrice } from './ui.js'

const $ = (id) => document.getElementById(id)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

let catalog = []
let profile = loadProfile()

let form, summaryBox, fields

const initials = (name) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'

/* ---------- Profile header + form ---------- */

function renderProfile() {
  $('account-avatar').textContent = initials(profile.name)
  $('account-name').textContent = profile.name || 'Maker'
  $('account-bench').textContent = profile.bench || 'Add a bench name below'
  $('account-email').textContent = profile.email
  $('account-email').hidden = !profile.email
}

function fillForm() {
  fields.name.value = profile.name
  fields.bench.value = profile.bench
  fields.email.value = profile.email
  clearErrors()
}

function validate(data) {
  const errors = {}
  if (!data.name) errors.name = 'Enter a display name.'
  if (data.email && !EMAIL.test(data.email)) errors.email = 'Enter an email like name@example.com.'
  return errors
}

const read = () => ({ name: fields.name.value.trim(), bench: fields.bench.value.trim(), email: fields.email.value.trim() })

function setFieldError(key, message) {
  const el = $(`pf-${key}-error`)
  if (!el) return
  el.textContent = message || ''
  fields[key].toggleAttribute('aria-invalid', Boolean(message))
}

function clearErrors() {
  ;['name', 'email'].forEach((k) => setFieldError(k, ''))
  summaryBox.hidden = true
}

function bindEvents() {
  // Inline validation on blur (one field at a time), full check with an error summary on submit.
  ;['name', 'email'].forEach((key) =>
    fields[key].addEventListener('blur', () => setFieldError(key, validate(read())[key]))
  )

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = read()
    const errors = validate(data)
    ;['name', 'email'].forEach((k) => setFieldError(k, errors[k]))
    const keys = Object.keys(errors)
    if (keys.length) {
      summaryBox.querySelector('ul').innerHTML = keys
        .map((k) => `<li><a href="#pf-${k}" data-focus="${k}">${escapeHtml(errors[k])}</a></li>`)
        .join('')
      summaryBox.hidden = false
      summaryBox.focus()
      return
    }
    summaryBox.hidden = true
    profile = data
    saveProfile(profile)
    renderProfile()
    showToast('Profile saved.')
  })

  // Summary links focus the field without touching the URL hash (the hash drives navigation).
  summaryBox.addEventListener('click', (event) => {
    const link = event.target.closest('[data-focus]')
    if (!link) return
    event.preventDefault()
    fields[link.dataset.focus].focus()
  })

  $('profile-reset').addEventListener('click', () => {
    fillForm()
    showToast('Changes discarded.')
  })

  $('profile-clear').addEventListener('click', () => {
    if (!confirm('Remove your profile from this browser? Your inventory will not be deleted.')) return
    clearProfile()
    profile = loadProfile()
    fillForm()
    renderProfile()
    showToast('Profile removed.')
  })

}

/* ---------- Stats + restock list ---------- */

function renderStats() {
  const parts = getParts()
  const units = parts.reduce((sum, p) => sum + p.quantity, 0)
  const attention = parts.filter((p) => getStockStatus(p.quantity, p.minStock) !== 'ok')
  const priceOf = (p) => catalog.find((c) => c.id === p.catalogId)?.price
  const priced = parts.filter((p) => priceOf(p) != null)
  const value = priced.reduce((sum, p) => sum + priceOf(p) * p.quantity, 0)
  const unpriced = parts.length - priced.length

  const stats = [
    ['Part types', parts.length, 'in your inventory', ''],
    ['Total units', units, 'across all parts', ''],
    ['Needs attention', attention.length, 'low or out of stock', attention.length ? 'warn' : ''],
    ['Estimated value', formatPrice(value), unpriced ? `${unpriced} part(s) without a price` : 'from catalog prices', ''],
  ]
  $('account-stats').innerHTML = stats
    .map(([label, value, note, tone]) => `<li class="card stat${tone ? ' stat-' + tone : ''}"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><small>${note}</small></li>`)
    .join('')

  const list = $('account-restock')
  const empty = $('account-restock-empty')
  const worst = [...attention].sort((a, b) => a.quantity - b.quantity).slice(0, 5)
  list.innerHTML = worst
    .map((p) => {
      const status = getStockStatus(p.quantity, p.minStock)
      return `<li><span>${escapeHtml(p.name)}</span><span class="badge badge-${status}">${status === 'out' ? 'Out of stock' : 'Low · ' + p.quantity}</span></li>`
    })
    .join('')
  list.hidden = worst.length === 0
  empty.hidden = worst.length > 0
  empty.textContent = parts.length === 0 ? 'No parts yet. Add some from the catalog to start tracking stock.' : 'Everything is stocked. Nothing needs restocking.'
}

export function initAccount(catalogData) {
  // Safe if the Account section is missing from index.html: skip instead of breaking the whole site.
  form = $('profile-form')
  if (!form) return console.warn('Account page markup not found in index.html; skipping.')
  summaryBox = $('profile-errors')
  fields = { name: form.elements.name, bench: form.elements.bench, email: form.elements.email }
  catalog = catalogData
  bindEvents()
  fillForm()
  renderProfile()
  renderStats()
  subscribe(renderStats)
}