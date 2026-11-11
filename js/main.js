import { initInventory } from './inventory.js'
import { initCatalog } from './catalog.js'
import { initHome } from './home.js'
import { getParts, subscribe } from './store.js'
import { icon } from './icons.js'
import { motionEnabled } from './settings.js'
import { initSettings } from './settings-page.js'
import { initAccount } from './account.js'
import { initContact } from './contact.js'

const pages = document.querySelectorAll('.page')
const navLinks = document.querySelectorAll('#nav-links a')
const menuToggle = document.getElementById('menu-toggle')
const navList = document.getElementById('nav-links')
const invCount = document.getElementById('inv-count')

// Simple navigation: show the page named in the URL hash (#home, #catalog, #inventory ...).
let firstLoad = true

function showPage() {
  const name = location.hash.replace('#', '') || 'home'
  const target = document.getElementById(`page-${name}`) ? name : 'home'

  const swap = () => {
    pages.forEach((p) => (p.hidden = p.id !== `page-${target}`))
    navLinks.forEach((a) => a.classList.toggle('active', a.dataset.page === target))
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

// Load the catalog with the Fetch API (Module 6), then start every page.
async function start() {
  let catalog = []
  try {
    const response = await fetch('data/catalog.json')
    if (!response.ok) throw new Error('Unable to load catalog.')
    catalog = await response.json()
  } catch (error) {
    console.error(error.message)
  }
  initInventory(catalog)
  initCatalog(catalog)
  initHome(catalog)
  initSettings()
  initAccount(catalog)
  initContact()
  subscribe(updateCount)
  updateCount()
  showPage()
}

start()
