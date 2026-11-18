import { getParts, setParts, subscribe, reloadAccountParts } from './store.js'
import { getCurrentAccount, signIn, signUp, signOut, adjustCurrentBalance, isAccountServiceConfigured } from './accounts.js'
import { getStockStatus, tracksLowStock } from './availability.js'
import { loadProfile, saveProfile } from './profile.js'
import { showToast, escapeHtml, formatPrice, confirmInApp } from './ui.js'
import { refreshCart } from './cart.js'

const $ = (id) => document.getElementById(id)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHOTO_LIMIT = 2 * 1024 * 1024

let catalog = []
let profile = loadProfile()
let form, summaryBox, fields
let balanceDirection = 'in'
const balanceFormat = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

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
  $('auth-panel').hidden = Boolean(account)
  $('login-form').hidden = Boolean(account)
  if ($('signup-form')) $('signup-form').hidden = Boolean(account) || $('show-signup').getAttribute('aria-selected') !== 'true'
  $('account-content').hidden = !account
  const configured = isAccountServiceConfigured()
  $('auth-setup-notice').hidden = Boolean(account) || (configured && !window.PYESA_AUTH_INIT_ERROR)
  if (window.PYESA_AUTH_INIT_ERROR) $('auth-setup-notice').textContent = 'Could not connect to the account service. Check the Supabase project settings and try refreshing.'
  if (!configured) {
    $('login-form').querySelector('button[type="submit"]').disabled = true
    $('signup-form').querySelector('button[type="submit"]').disabled = true
  }
  if (!account) return
  profile = loadProfile()
  $('account-role').textContent = account.role === 'admin' ? 'Administrator account' : 'Student account'
  renderBalance()
  fillForm()
  renderProfile()
  renderStats()
}

function renderBalance() {
  const account = getCurrentAccount()
  $('account-balance').textContent = balanceFormat.format(account?.balance ?? 0)
}

function openBalanceDialog(direction) {
  balanceDirection = direction
  $('balance-dialog-title').textContent = direction === 'in' ? 'Cash in' : 'Cash out'
  $('balance-submit').textContent = direction === 'in' ? 'Cash in' : 'Cash out'
  $('balance-amount').value = ''
  $('balance-error').hidden = true
  $('balance-dialog').showModal()
  $('balance-amount').focus()
}

function bindEvents() {
  const loginForm = $('login-form')
  const signupForm = $('signup-form')
  $('show-signin').addEventListener('click', () => setAuthTab('signin'))
  $('show-signup').addEventListener('click', () => setAuthTab('signup'))
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const submit = loginForm.querySelector('button[type="submit"]')
    submit.disabled = true
    const password = loginForm.elements.password.value
    try {
      await signIn(loginForm.elements.email.value, password)
      $('login-error').hidden = true
      loginForm.reset()
      reloadAccountParts()
      refreshCart()
      renderSession()
      showToast('Signed in.')
    } catch (error) {
      $('login-error').textContent = error.message || 'We could not sign you in. Check your email and password.'
      $('login-error').hidden = false
    } finally {
      submit.disabled = !isAccountServiceConfigured()
    }
  })
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!signupForm.reportValidity()) return
    const submit = signupForm.querySelector('button[type="submit"]')
    submit.disabled = true
    $('signup-error').hidden = true
    $('signup-success').hidden = true
    try {
      const result = await signUp({ name: signupForm.elements.name.value, email: signupForm.elements.email.value, password: signupForm.elements.password.value })
      if (result.needsEmailConfirmation) {
        $('signup-success').textContent = 'Account created. Check your email to confirm it, then sign in here.'
        $('signup-success').hidden = false
        signupForm.reset()
      } else {
        signupForm.reset()
        reloadAccountParts()
        refreshCart()
        renderSession()
        showToast('Account created and signed in.')
      }
    } catch (error) {
      $('signup-error').textContent = error.message || 'We could not create the account. Please try again.'
      $('signup-error').hidden = false
    } finally {
      submit.disabled = !isAccountServiceConfigured()
    }
  })
  $('account-logout').addEventListener('click', async () => {
    try { await signOut() } catch (error) { return showToast(error.message || 'Unable to sign out.', true) }
    reloadAccountParts()
    refreshCart()
    renderSession()
    showToast('Signed out.')
  })

  $('cash-in').addEventListener('click', () => openBalanceDialog('in'))
  $('cash-out').addEventListener('click', () => openBalanceDialog('out'))
  $('balance-cancel').addEventListener('click', () => $('balance-dialog').close())
  $('balance-dialog').addEventListener('click', (event) => {
    if (event.target === $('balance-dialog')) $('balance-dialog').close()
  })
  $('balance-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const amount = Number($('balance-amount').value)
    if (!$('balance-form').reportValidity()) return
    const next = adjustCurrentBalance(balanceDirection === 'in' ? amount : -amount)
    if (next === null) {
      $('balance-error').textContent = 'Cash out cannot be greater than your current balance.'
      $('balance-error').hidden = false
      return
    }
    $('balance-dialog').close()
    renderBalance()
    window.dispatchEvent(new Event('pyesa-balance-updated'))
    showToast(balanceDirection === 'in' ? 'Balance updated.' : 'Cash out recorded.')
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
  $('profile-clear').addEventListener('click', async () => {
    const priceOf = (part) => catalog.find((item) => item.id === part.catalogId)?.price
    const soldParts = getParts().filter((part) => part.ownership !== 'on-hold' && Number.isFinite(Number(priceOf(part))) && priceOf(part) != null && part.quantity > 0)
    if (!soldParts.length) {
      showToast('There are no priced, owned parts to sell.', true)
      return
    }
    const proceeds = Math.round(soldParts.reduce((sum, part) => sum + Number(priceOf(part)) * part.quantity, 0) * 100) / 100
    if (!await confirmInApp({
      title: 'Sell inventory?',
      message: `Sell ${soldParts.length} priced, owned part type(s) for ${formatPrice(proceeds)}? The money will be added to your balance. Unpriced and on-hold parts will stay in your inventory.`,
      confirmLabel: 'Sell inventory',
    })) return
    if (proceeds > 0) adjustCurrentBalance(proceeds)
    const soldIds = new Set(soldParts.map((part) => part.id))
    setParts(getParts().filter((part) => !soldIds.has(part.id)))
    reloadAccountParts()
    renderBalance()
    window.dispatchEvent(new Event('pyesa-balance-updated'))
    showToast(`Inventory sold for ${formatPrice(proceeds)}.`)
  })
}

function setAuthTab(tab) {
  const signingUp = tab === 'signup'
  $('show-signin').classList.toggle('active', !signingUp)
  $('show-signup').classList.toggle('active', signingUp)
  $('show-signin').setAttribute('aria-selected', String(!signingUp))
  $('show-signup').setAttribute('aria-selected', String(signingUp))
  $('login-form').hidden = signingUp
  $('signup-form').hidden = !signingUp
  if (signingUp) $('signup-name').focus()
  else $('login-email').focus()
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
  window.addEventListener('pyesa-session-updated', renderSession)
  window.addEventListener('pyesa-balance-updated', renderBalance)
  subscribe(renderStats)
}
