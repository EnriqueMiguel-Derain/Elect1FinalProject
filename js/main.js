import { initInventory } from './inventory.js'
import { initCatalog } from './catalog.js'
import { initHome } from './home.js'
import { getParts, subscribe } from './store.js'
import { icon } from './icons.js'

const pages = document.querySelectorAll('.page')
const navLinks = document.querySelectorAll('#nav-links a')
const menuToggle = document.getElementById('menu-toggle')
const navList = document.getElementById('nav-links')
const invCount = document.getElementById('inv-count')
let focusSearch = false

// Simple navigation: show the page named in the URL hash (#home, #catalog, #inventory).
function showPage() {
  const name = location.hash.replace('#', '') || 'home'
  const target = document.getElementById(`page-${name}`) ? name : 'home'
  pages.forEach((p) => (p.hidden = p.id !== `page-${target}`))
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.page === target))
  navList.classList.remove('open')
  menuToggle.setAttribute('aria-expanded', 'false')
  window.scrollTo(0, 0)
  if (focusSearch && target === 'catalog') document.getElementById('catalog-search').focus()
  focusSearch = false
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
document.getElementById('search-link').addEventListener('click', () => (focusSearch = true))
window.addEventListener('hashchange', showPage)

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
  subscribe(updateCount)
  updateCount()
  showPage()
}

start()
