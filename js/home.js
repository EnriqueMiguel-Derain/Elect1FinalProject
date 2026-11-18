import { getParts, subscribe } from './store.js'
import { getCurrentAccount } from './accounts.js'
import { addToCart, addBundleToCart, addItemsToCart } from './cart.js'
import { assemblePCSet } from './inventory.js'
import { productCard } from './components.js'
import { setCatalogCategory } from './catalog.js'
import { icon } from './icons.js'
import { showToast, formatPrice, escapeHtml, confirmInApp } from './ui.js'
import { showItemDetails } from './item-details.js'

const ESSENTIAL_PARTS = ['cpu-r5-7600', 'cooler-amd-wraith-stealth', 'mb-msi-b650m', 'ram-kingston-16-ddr5', 'ssd-samsung-990-1tb', 'psu-msi-a550bn', 'case-cm-elite302']
const GAMING_PARTS = [...ESSENTIAL_PARTS, 'gpu-zotac-4060']
const PC_PACKAGES = [
  { id: 'essential-pc', name: 'Essential PC', note: 'Core PC components · no discrete graphics card', partIds: ESSENTIAL_PARTS },
  { id: 'gaming-pc', name: 'Gaming PC', note: 'Core components with a dedicated graphics card', partIds: GAMING_PARTS, featured: true },
  { id: 'complete-setup', name: 'Complete Gaming Setup', note: 'Gaming PC plus monitor, keyboard, and mouse', partIds: [...GAMING_PARTS, 'mon-aoc-24g50f', 'kb-aula-au75', 'mouse-aula-sc580x'] },
]

const CATEGORY_LABELS = {
  CPU: 'Processors', GPU: 'Graphics Cards', RAM: 'Memory',
  Microcontroller: 'Microcontrollers', Sensor: 'Sensors',
}

export function initHome(catalog) {
  const byId = (id) => catalog.find((c) => c.id === id)
  const picks = catalog.filter((c) => c.featured).slice(0, 8)
  const picksGrid = document.getElementById('top-picks')
  const categoryCounts = catalog.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1
    return counts
  }, {})

  document.getElementById('hero-count').textContent = catalog.length

  const mostAbundant = Object.entries(categoryCounts)
    .sort(([categoryA, countA], [categoryB, countB]) => countB - countA || categoryA.localeCompare(categoryB))
    .slice(0, 6)
  document.getElementById('category-grid').innerHTML = mostAbundant.map(
    ([category, count]) => `
    <a class="tile" href="#catalog" data-category="${escapeHtml(category)}">
      <span class="tile-icon">${icon(category, 96)}</span>
      <h3>${escapeHtml(CATEGORY_LABELS[category] || category)}</h3>
      <small>${count} part(s)</small>
    </a>`
  ).join('')

  const renderPicks = () => (picksGrid.innerHTML = picks.map((p) => productCard(p, getParts())).join(''))
  renderPicks()
  subscribe(renderPicks)

  picksGrid.addEventListener('click', (event) => {
    const details = event.target.closest('[data-details]')
    if (details) {
      const item = byId(details.dataset.details)
      if (item) showItemDetails(item, null, { onAdd: () => {
        if (!addToCart(item)) {
          showToast('Sign in from the Account page to add items to your cart.')
          return
        }
        showToast(`${item.name} added to your cart.`)
      } })
      return
    }
    const btn = event.target.closest('[data-add]')
    if (!btn) return
    const item = byId(btn.dataset.add)
    if (!addToCart(item)) {
      showToast('Sign in to add items to your cart.')
      location.hash = '#account'
      return
    }
    showToast(`${item.name} added to your cart.`)
  })

  // Ready builds
  const presetsEl = document.getElementById('presets')
  presetsEl.innerHTML = PC_PACKAGES.map((p, i) => {
    const items = p.partIds.map(byId).filter(Boolean)
    const total = Math.round(items.reduce((sum, c) => sum + (Number(c.price) || 0), 0) * 0.9 * 100) / 100
    return `
    <article class="preset reveal${p.featured ? ' featured' : ''}" style="transition-delay:${i * 90}ms">
      <div class="preset-head">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="preset-price">${formatPrice(total)}<small>with 10% full-package offer · ${escapeHtml(p.note)}</small></div>
      </div>
      <ul>${items.map((c) => `<li>${escapeHtml(c.name)}</li>`).join('')}</ul>
      <div class="preset-foot"><a class="btn btn-block" href="#pc-builder">See package options</a></div>
    </article>`
  }).join('')

  initPCBuilder(catalog)

  // Any link with data-category (tiles, banner, footer) pre-filters the Catalog page.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]')
    if (link) setCatalogCategory(link.dataset.category)
  })

  // Gentle scroll reveal (respects reduced motion via CSS).
  const reveals = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
    reveals.forEach((el) => io.observe(el))
  } else reveals.forEach((el) => el.classList.add('in'))
}

function initPCBuilder(catalog) {
  const builder = document.getElementById('pc-builder-packages')
  const loginPrompt = document.getElementById('pc-builder-login')
  const accountSummary = document.getElementById('pc-builder-balance')
  if (!builder || !loginPrompt || !accountSummary) return

  const getPackageParts = (build) => build.partIds.map((id) => catalog.find((item) => item.id === id))
  const getAccountQuantities = (item) => getParts().filter((part) => part.catalogId === item.id).reduce((counts, part) => {
    const key = part.ownership === 'on-hold' ? 'onHold' : 'owned'
    counts[key] += Number(part.quantity || 0)
    return counts
  }, { owned: 0, onHold: 0 })

  const render = () => {
    const account = getCurrentAccount()
    loginPrompt.hidden = Boolean(account)
    accountSummary.hidden = !account
    builder.hidden = !account
    if (!account) return

    accountSummary.textContent = `Available balance: ${formatPrice(account.balance)} · Bundle prices shown below include a 10% full-package discount.`
    builder.innerHTML = PC_PACKAGES.map((build) => {
      const items = getPackageParts(build)
      const missingCatalogItems = items.filter((item) => !item)
      if (missingCatalogItems.length) {
        return `<article class="pc-package card"><h2>${escapeHtml(build.name)} is unavailable</h2><p>One or more package components are missing from the catalog.</p></article>`
      }
      const retailTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
      const discountedTotal = Math.round(retailTotal * 90) / 100
      const missing = items.filter((item) => {
        const count = getAccountQuantities(item)
        return count.owned + count.onHold < 1
      })
      const canAssemble = items.every((item) => {
        const count = getAccountQuantities(item)
        return count.owned + count.onHold >= 1
      })
      const missingTotal = missing.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
      return `
        <article class="pc-package card${build.featured ? ' pc-package-featured' : ''}">
          <div class="pc-package-heading"><div><p class="eyebrow">${items.length} components</p><h2>${escapeHtml(build.name)}</h2><p>${escapeHtml(build.note)}</p></div><span class="pc-package-discount">10% off</span></div>
          <ul class="pc-package-parts">${items.map((item) => {
            const count = getAccountQuantities(item)
            const have = count.owned + count.onHold
            const status = count.owned && count.onHold
              ? `In inventory · ${count.owned} owned, ${count.onHold} on hold`
              : count.owned
                ? `✓ In inventory · ${count.owned} owned`
                : count.onHold
                  ? `In inventory · ${count.onHold} on hold`
                  : 'Needed'
            return `<li><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.subcategory || item.category)} · ${formatPrice(item.price)}</small></span><span class="tag ${count.owned ? 'tag-ok' : 'tag-hold'}">${escapeHtml(status)}</span></li>`
          }).join('')}</ul>
          <div class="pc-package-prices">
            <p><span>Package price</span><s>${formatPrice(retailTotal)}</s></p>
            <p class="pc-package-total"><span>Complete package</span><strong>${formatPrice(discountedTotal)}</strong></p>
            <p><span>Missing parts only · no discount</span><strong>${formatPrice(missingTotal)}</strong></p>
          </div>
          <div class="pc-package-actions">
            <button type="button" class="btn" data-buy-package="${escapeHtml(build.id)}">Buy complete package · save ${formatPrice(retailTotal - discountedTotal)}</button>
            <button type="button" class="btn btn-secondary" data-buy-missing="${escapeHtml(build.id)}" ${missing.length ? '' : 'disabled'}>${missing.length ? `Buy ${missing.length} missing part${missing.length === 1 ? '' : 's'} · no discount` : 'You already have all parts'}</button>
            <button type="button" class="btn btn-secondary" data-assemble-package="${escapeHtml(build.id)}" ${canAssemble ? '' : 'disabled'}>${canAssemble ? 'Build set from inventory' : 'Build set · need all parts'}</button>
          </div>
          <p class="pc-package-footnote">Complete-package savings apply only when all parts in this package are checked out together.</p>
        </article>`
    }).join('')
  }

  builder.addEventListener('click', async (event) => {
    const fullButton = event.target.closest('[data-buy-package]')
    const missingButton = event.target.closest('[data-buy-missing]')
    const assembleButton = event.target.closest('[data-assemble-package]')
    if (!fullButton && !missingButton && !assembleButton) return
    const packageId = fullButton
      ? fullButton.dataset.buyPackage
      : missingButton
        ? missingButton.dataset.buyMissing
        : assembleButton.dataset.assemblePackage
    const build = PC_PACKAGES.find((item) => item.id === packageId)
    if (!build) return
    const items = getPackageParts(build)
    if (items.some((item) => !item)) {
      showToast('This package has a component missing from the catalog.', true)
      return
    }

    if (assembleButton) {
      if (!await confirmInApp({
        title: 'Build PC set from inventory?',
        message: `Use one of each of the ${items.length} listed parts to create a ${build.name} set?`,
        confirmLabel: 'Build set',
      })) return
      const result = assemblePCSet(build, catalog)
      if (!result.ok) return showToast(result.message, true)
      showToast(`${build.name} built from your inventory parts.`)
      location.hash = '#inventory'
      return
    }

    if (fullButton) {
      if (!addBundleToCart(items, build.name, build.id)) {
        showToast('Sign in before adding a package to your cart.')
        location.hash = '#account'
        return
      }
      showToast(`${build.name} added to your cart with the 10% package offer.`)
    } else {
      const missing = items.filter((item) => {
        const count = getAccountQuantities(item)
        return count.owned + count.onHold < 1
      })
      if (!missing.length) return
      if (!addItemsToCart(missing)) {
        showToast('Sign in before adding parts to your cart.')
        location.hash = '#account'
        return
      }
      showToast(`${missing.length} missing part(s) added at regular catalog prices.`)
    }
    location.hash = '#cart'
  })

  subscribe(render)
  window.addEventListener('pyesa-balance-updated', render)
  render()
}
