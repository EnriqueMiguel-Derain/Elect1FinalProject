import { initInventory } from './inventory.js'
import { initCatalog } from './catalog.js'
import { initHome } from './home.js'
import { getParts, subscribe, reloadAccountParts } from './store.js'
import { initializeAccounts } from './accounts.js'
import { icon } from './icons.js'
import { motionEnabled } from './settings.js'
import { initSettings } from './settings-page.js'
import { initAccount } from './account.js'
import { initContact } from './contact.js'
import { initCartPage, getCartCount, subscribeCart, refreshCart } from './cart.js'
import { initCircuitBuilder } from './circuit-builder.js'
import { showToast } from './ui.js'

const pages = document.querySelectorAll('.page')
const navLinks = document.querySelectorAll('#nav-links a')
const menuToggle = document.getElementById('menu-toggle')
const navList = document.getElementById('nav-links')
const invCount = document.getElementById('inv-count')
const cartCount = document.getElementById('cart-count')
const cartLink = document.getElementById('cart-link')

// Simple navigation: show the page named in the URL hash (#home, #catalog, #inventory ...).
let firstLoad = true

function showPage() {
  const name = location.hash.replace('#', '') || 'home'
  const target = document.getElementById(`page-${name}`) ? name : 'home'

  const swap = () => {
    pages.forEach((p) => (p.hidden = p.id !== `page-${target}`))
    navLinks.forEach((a) => a.classList.toggle('active', a.dataset.page === target))
    cartLink.classList.toggle('active', target === 'cart')
    cartLink.setAttribute('aria-current', target === 'cart' ? 'page' : 'false')
    navList.classList.remove('open')
    menuToggle.setAttribute('aria-expanded', 'false')
    window.scrollTo(0, 0)
  }

  // Page transition: View Transitions API where supported, a simple fade-up everywhere else.
  if (!firstLoad && motionEnabled() && document.startViewTransition) {
    document.startViewTransition(swap)
  } else {
    swap()
    if (!firstLoad && motionEnabled()) {
      const el = document.getElementById(`page-${target}`)
      el.classList.remove('page-enter')
      void el.offsetWidth // restart the animation
      el.classList.add('page-enter')
    }
  }
  firstLoad = false
}

function updateCount() {
  const total = getParts().reduce((sum, p) => sum + p.quantity, 0)
  invCount.textContent = total
  invCount.hidden = total === 0
}

function updateCartCount() {
  const total = getCartCount()
  cartCount.textContent = total
  cartCount.hidden = total === 0
}

menuToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open')
  menuToggle.setAttribute('aria-expanded', String(open))
})
window.addEventListener('hashchange', showPage)

// Logo: on the home page just scroll to the top; from other pages the link goes home.
document.querySelectorAll('.brand').forEach((brand) =>
  brand.addEventListener('click', (event) => {
    const onHome = (location.hash.replace('#', '') || 'home') === 'home'
    if (onHome) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'auto' })
    }
  })
)

// Back-to-top button (bottom right) and header shadow once the page is scrolled.
const toTop = document.getElementById('to-top')
const header = document.querySelector('.site-header')
function onScroll() {
  toTop.classList.toggle('show', window.scrollY > 400)
  header.classList.toggle('scrolled', window.scrollY > 8)
}
window.addEventListener('scroll', onScroll, { passive: true })
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'auto' }))
onScroll()

// Skip link: move focus to the page content without changing the URL hash (the hash drives navigation).
document.getElementById('skip-link').addEventListener('click', (event) => {
  event.preventDefault()
  document.getElementById('main').focus()
})

document.querySelectorAll('[data-icon]').forEach((el) => (el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 22)))
document.getElementById('year').textContent = new Date().getFullYear()

// Render the requested page before any remote account or catalog setup. If a
// service is unavailable, the site shell and hash navigation remain usable.
showPage()

function safelyInitialize(name, initialize) {
  try {
    initialize()
  } catch (error) {
    console.error(`Unable to initialize ${name}:`, error)
  }
}

// Load the catalog with the Fetch API (Module 6), then start every page.
async function start() {
  // Start account setup in the background. A slow/unavailable auth service
  // must not prevent catalog rendering or the page controls from starting.
  const accountReady = initializeAccounts().catch((error) => {
    console.error('Account service could not start:', error)
    window.PYESA_AUTH_INIT_ERROR = true
    return false
  })
  let catalog = []
  try {
    const response = await fetch('data/catalog.json')
    if (!response.ok) throw new Error('Unable to load catalog.')
    catalog = await response.json()
  } catch (error) {
    console.error(error.message)
  }
  safelyInitialize('inventory', () => initInventory(catalog))
  safelyInitialize('catalog', () => initCatalog(catalog))
  safelyInitialize('cart', () => initCartPage(catalog))
  safelyInitialize('home', () => initHome(catalog))
  safelyInitialize('circuit builder', () => initCircuitBuilder(catalog))
  safelyInitialize('settings', () => initSettings())
  safelyInitialize('account', () => initAccount(catalog))
  safelyInitialize('contact', () => initContact())
  subscribe(updateCount)
  subscribeCart(updateCartCount)
  updateCount()
  updateCartCount()
  showPage()

  const accountsConnected = await accountReady
  if (accountsConnected) {
    reloadAccountParts()
    refreshCart()
    window.dispatchEvent(new Event('pyesa-session-updated'))
  }
}

window.addEventListener('pyesa-cloud-save-error', () => showToast('Could not sync your latest account changes. Check your connection and try again.', true))

start()
