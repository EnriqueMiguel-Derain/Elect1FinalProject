import { getParts, subscribe, reloadAccountParts } from './store.js'
import { getCurrentAccount, signIn, signOut, clearAccountInventory } from './accounts.js'
import { getStockStatus, tracksLowStock } from './availability.js'
import { loadProfile, saveProfile } from './profile.js'
import { showToast, escapeHtml, formatPrice } from './ui.js'

const $ = (id) => document.getElementById(id)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHOTO_LIMIT = 2 * 1024 * 1024

let catalog = []
let profile = loadProfile()
let form, summaryBox, fields

const initials = (name) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'

function renderProfile() {
  const avatar = $('account-avatar')
  avatar.replaceChildren()
  if (profile.photo) {
    const image = document.createElement('img')
    image.src = profile.photo
    image.alt = `${profile.name || 'Account'} profile picture`
    avatar.append(image)
  } else avatar.textContent = initials(profile.name)
  $('account-name').textContent = profile.name || 'Maker'
  $('account-bench').textContent = profile.bench || 'Add a bench name below'
  $('account-email').textContent = profile.email
  $('account-email').hidden = !profile.email
}

function fillForm() {
  fields.name.value = profile.name
  fields.bench.value = profile.bench
  fields.email.value = profile.email
  form.elements.photo.value = ''
  clearErrors()
}

function validate(data) {
  const errors = {}
  if (!data.name) errors.name = 'Enter a display name.'
  if (data.email && !EMAIL.test(data.email)) errors.email = 'Enter a valid email address.'
  return errors
}

const read = () => ({ name: fields.name.value.trim(), bench: fields.bench.value.trim(), email: fields.email.value.trim(), photo: profile.photo || '' })

function setFieldError(key, message) {
  const el = $(`pf-${key}-error`)
  if (!el) return
  el.textContent = message || ''
  fields[key].toggleAttribute('aria-invalid', Boolean(message))
}

function clearErrors() {
  ;['name', 'email'].forEach((key) => setFieldError(key, ''))
  summaryBox.hidden = true
}

function renderSession() {
  const account = getCurrentAccount()
  $('login-form').hidden = Boolean(account)
  $('account-content').hidden = !account
  if (!account) return
  profile = loadProfile()
  $('account-role').textContent = account.role === 'admin' ? 'Administrator account' : 'Student account'
  fillForm()
  renderProfile()
  renderStats()
}

function bindEvents() {
  const loginForm = $('login-form')
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const username = loginForm.elements.username.value
    const password = loginForm.elements.password.value
    if (!signIn(username, password)) {
      $('login-error').textContent = 'That username and password do not match.'
      $('login-error').hidden = false
      return
    }
    $('login-error').hidden = true
    loginForm.reset()
    reloadAccountParts()
    renderSession()
    showToast('Signed in.')
  })
  $('account-logout').addEventListener('click', () => {
    signOut()
    reloadAccountParts()
    renderSession()
    showToast('Signed out.')
  })

  ;['name', 'email'].forEach((key) => fields[key].addEventListener('blur', () => setFieldError(key, validate(read())[key])))
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = read()
    const errors = validate(data)
    ;['name', 'email'].forEach((key) => setFieldError(key, errors[key]))
    const keys = Object.keys(errors)
    if (keys.length) {
      summaryBox.querySelector('ul').innerHTML = keys.map((key) => `<li><a href="#pf-${key}" data-focus="${key}">${escapeHtml(errors[key])}</a></li>`).join('')
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
  summaryBox.addEventListener('click', (event) => {
    const link = event.target.closest('[data-focus]')
    if (!link) return
    event.preventDefault()
    fields[link.dataset.focus].focus()
  })
  $('profile-reset').addEventListener('click', () => {
    profile = loadProfile()
    fillForm()
    showToast('Changes discarded.')
  })
  form.elements.photo.addEventListener('change', () => {
    const file = form.elements.photo.files[0]
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > PHOTO_LIMIT) {
      form.elements.photo.value = ''
      showToast('Choose an image smaller than 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      profile = { ...profile, photo: String(reader.result) }
      saveProfile(profile)
      renderProfile()
      showToast('Profile picture updated.')
    })
    reader.readAsDataURL(file)
  })
  $('profile-clear').addEventListener('click', () => {
    if (!confirm('Clear all parts from this account’s inventory?')) return
    clearAccountInventory()
    reloadAccountParts()
    showToast('Inventory cleared.')
  })
}

/* ---------- Stats + restock list ---------- */

function renderStats() {
  const parts = getParts()
  const units = parts.reduce((sum, part) => sum + part.quantity, 0)
  const attention = parts.filter((part) => tracksLowStock(part.category) && getStockStatus(part.quantity, part.minStock) !== 'ok')
  const priceOf = (part) => catalog.find((item) => item.id === part.catalogId)?.price
  const priced = parts.filter((part) => priceOf(part) != null)
  const value = priced.reduce((sum, part) => sum + priceOf(part) * part.quantity, 0)
  const unpriced = parts.length - priced.length
  const stats = [
    ['Part types', parts.length, 'in your inventory', ''],
    ['Total units', units, 'across all parts', ''],
    ['Electronic parts to restock', attention.length, 'low or out of stock', attention.length ? 'warn' : ''],
    ['Estimated value', formatPrice(value), unpriced ? `${unpriced} part(s) without a price` : 'from catalog prices', ''],
  ]
  $('account-stats').innerHTML = stats
    .map(([label, value, note, tone]) => `<li class="card stat${tone ? ' stat-' + tone : ''}"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><small>${note}</small></li>`)
    .join('')
  const list = $('account-restock')
  const empty = $('account-restock-empty')
  const worst = [...attention].sort((a, b) => a.quantity - b.quantity).slice(0, 5)
  list.innerHTML = worst.map((part) => {
    const status = getStockStatus(part.quantity, part.minStock)
    return `<li><span>${escapeHtml(part.name)}</span><span class="badge badge-${status}">${status === 'out' ? 'Out of stock' : 'Low · ' + part.quantity}</span></li>`
  }).join('')
  list.hidden = worst.length === 0
  empty.hidden = worst.length > 0
  empty.textContent = parts.length === 0 ? 'No parts yet. Add some from the catalog to start tracking stock.' : 'All electronic parts are stocked. No restocking needed.'
}

export function initAccount(catalogData) {
  form = $('profile-form')
  if (!form) return console.warn('Account page markup not found in index.html; skipping.')
  summaryBox = $('profile-errors')
  fields = { name: form.elements.name, bench: form.elements.bench, email: form.elements.email }
  catalog = catalogData
  bindEvents()
  renderSession()
  subscribe(renderStats)
}
