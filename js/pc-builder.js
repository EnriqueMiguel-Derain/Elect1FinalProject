import { getCurrentAccount } from './accounts.js'
import { getParts, subscribe } from './store.js'
import { addBundleToCart, addItemsToCart } from './cart.js'
import { escapeHtml, formatPrice, showToast } from './ui.js'
import { PC_PACKAGES } from './pc-packages.js'

const builder = document.getElementById('pc-builder-packages')
const loginPrompt = document.getElementById('pc-builder-login')
const accountSummary = document.getElementById('pc-builder-balance')

let catalog = []

export function initPCBuilder(catalogItems) {
  catalog = catalogItems
  builder.addEventListener('click', handlePackageAction)
  subscribe(render)
  window.addEventListener('pyesa-balance-updated', render)
  render()
}

function getPackageParts(build) {
  return build.partIds.map((id) => catalog.find((item) => item.id === id)).filter(Boolean)
}

function getAccountQuantities(item) {
  return getParts().filter((part) => part.catalogId === item.id).reduce((counts, part) => {
    const key = part.ownership === 'on-hold' ? 'onHold' : 'owned'
    counts[key] += Number(part.quantity || 0)
    return counts
  }, { owned: 0, onHold: 0 })
}

function render() {
  const account = getCurrentAccount()
  loginPrompt.hidden = Boolean(account)
  accountSummary.hidden = !account
  builder.hidden = !account
  if (!account) return

  accountSummary.textContent = `Available balance: ${formatPrice(account.balance)} · Bundle prices shown below include a 10% full-package discount.`
  builder.innerHTML = PC_PACKAGES.map((build) => {
    const items = getPackageParts(build)
    const retailTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    const discountedTotal = Math.round(retailTotal * 90) / 100
    const missing = items.filter((item) => {
      const count = getAccountQuantities(item)
      return count.owned + count.onHold < 1
    })
    const missingTotal = missing.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    return `
      <article class="pc-package card${build.featured ? ' pc-package-featured' : ''}">
        <div class="pc-package-heading"><div><p class="eyebrow">${items.length} components</p><h2>${escapeHtml(build.name)}</h2><p>${escapeHtml(build.note)}</p></div><span class="pc-package-discount">10% off</span></div>
        <ul class="pc-package-parts">${items.map((item) => {
          const count = getAccountQuantities(item)
          const have = count.owned + count.onHold
          const status = count.owned ? `Owned ${count.owned}` : count.onHold ? `On hold ${count.onHold}` : 'Need 1'
          return `<li><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} · ${formatPrice(item.price)}</small></span><span class="tag ${have ? 'tag-ok' : 'tag-hold'}">${status}</span></li>`
        }).join('')}</ul>
        <div class="pc-package-prices">
          <p><span>Package price</span><s>${formatPrice(retailTotal)}</s></p>
          <p class="pc-package-total"><span>Complete package</span><strong>${formatPrice(discountedTotal)}</strong></p>
          <p><span>Missing parts only · no discount</span><strong>${formatPrice(missingTotal)}</strong></p>
        </div>
        <div class="pc-package-actions">
          <button type="button" class="btn" data-buy-package="${escapeHtml(build.id)}">Buy complete package · save ${formatPrice(retailTotal - discountedTotal)}</button>
          <button type="button" class="btn btn-secondary" data-buy-missing="${escapeHtml(build.id)}" ${missing.length ? '' : 'disabled'}>${missing.length ? `Buy ${missing.length} missing part${missing.length === 1 ? '' : 's'} · no discount` : 'You already have all parts'}</button>
        </div>
        <p class="pc-package-footnote">Complete-package savings apply only when all parts in this package are checked out together.</p>
      </article>`
  }).join('')
}

function handlePackageAction(event) {
  const fullButton = event.target.closest('[data-buy-package]')
  const missingButton = event.target.closest('[data-buy-missing]')
  if (!fullButton && !missingButton) return

  const packageId = fullButton ? fullButton.dataset.buyPackage : missingButton.dataset.buyMissing
  const build = PC_PACKAGES.find((item) => item.id === packageId)
  if (!build) return
  const items = getPackageParts(build)

  if (fullButton) {
    const added = addBundleToCart(items, build.name)
    if (!added) {
      showToast('Sign in before adding a package to your cart.')
      location.hash = '#account'
      return
    }
    showToast(`${build.name} added to your cart with the 10% package offer.`)
    location.hash = '#cart'
    return
  }

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
  location.hash = '#cart'
}
