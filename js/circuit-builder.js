import { getCurrentAccount } from './accounts.js'
import { getParts } from './store.js'
import { addCircuitBundleToCart, addItemsToCart } from './cart.js'
import { assembleCircuitSet } from './inventory.js'
import { CIRCUIT_PACKAGES, resolveCircuitParts } from './circuit-packages.js'
import { formatPrice, escapeHtml, showToast, confirmInApp } from './ui.js'
import { subscribe } from './store.js'

export function initCircuitBuilder(catalog) {
  const builder = document.getElementById('circuit-builder-packages')
  const login = document.getElementById('circuit-builder-login')
  const balance = document.getElementById('circuit-builder-balance')
  if (!builder || !login || !balance) return
  const selections = new Map()
  const currentOptions = (project) => selections.get(project.id) || []
  const inventoryCount = (id) => getParts().filter((part) => part.catalogId === id)
    .reduce((sum, part) => sum + Number(part.quantity || 0), 0)

  const render = () => {
    const account = getCurrentAccount()
    login.hidden = Boolean(account)
    balance.hidden = !account
    builder.hidden = !account
    if (!account) return
    balance.textContent = `Available balance: ${formatPrice(account.balance)} · Complete project kits receive 10% off.`
    builder.innerHTML = CIRCUIT_PACKAGES.map((project) => {
      const lines = resolveCircuitParts(project, catalog, currentOptions(project))
      const required = resolveCircuitParts(project, catalog)
      const missingItems = lines.filter((line) => !line.item)
      const missingCatalog = missingItems.length > 0
      const retail = lines.reduce((sum, line) => sum + (Number(line.item?.price) || 0) * line.packQuantity, 0)
      const discounted = Math.round(retail * 90) / 100
      const missingLines = required.filter((line) => line.item && inventoryCount(line.id) < line.packQuantity)
      const missingCost = missingLines.reduce((sum, line) => sum + Number(line.item.price) * Math.max(0, line.packQuantity - inventoryCount(line.id)), 0)
      const canBuild = lines.every((line) => line.item && inventoryCount(line.id) >= line.packQuantity)
      const optionChecks = (project.optional || []).map(([id, label]) => `<label class="circuit-option"><input type="checkbox" data-circuit-option="${escapeHtml(project.id)}" value="${escapeHtml(id)}" ${currentOptions(project).includes(id) ? 'checked' : ''}> Include ${escapeHtml(label)}</label>`).join('')
      return `<article class="pc-package card circuit-package">
        <div class="pc-package-heading"><div><p class="eyebrow">${lines.length} catalog components</p><h2>${escapeHtml(project.name)}</h2><p>${escapeHtml(project.note)}</p></div><span class="pc-package-discount">10% off</span></div>
        ${optionChecks ? `<fieldset class="circuit-options"><legend>Optional components</legend>${optionChecks}<small>These are optional extras from the supplied project list; add them only if your implementation uses them.</small></fieldset>` : ''}
        <ul class="pc-package-parts">${lines.map((line) => {
          const owned = inventoryCount(line.id)
          const status = owned >= line.packQuantity ? `✓ In inventory · ${owned} pack${owned === 1 ? '' : 's'}` : 'Needed'
          const physical = line.physicalQuantity === 1 ? '1 pc' : `${line.physicalQuantity} pcs`
          const pack = Number(line.item?.specs?.quantityInPack) || 1
          const purchase = line.packQuantity === 1 ? '1 catalog pack' : `${line.packQuantity} catalog packs`
          return `<li><span><strong>${escapeHtml(line.item?.name || 'Catalog component missing')}</strong><small>${escapeHtml(line.item?.category || '')} · ${line.breakdown?.length ? `${line.breakdown.map(escapeHtml).join(' + ')} · ` : ''}${physical} total · ${purchase}${pack > 1 ? ` (${pack} pcs/pack)` : ''} · ${line.item ? formatPrice(Number(line.item.price) * line.packQuantity) : '—'}</small></span><span class="tag ${owned >= line.packQuantity ? 'tag-ok' : 'tag-hold'}">${status}</span></li>`
        }).join('')}</ul>
        <div class="pc-package-prices"><p><span>Catalog-pack total</span><s>${formatPrice(retail)}</s></p><p class="pc-package-total"><span>Complete kit</span><strong>${formatPrice(discounted)}</strong></p><p><span>Required missing packs · no discount</span><strong>${formatPrice(missingCost)}</strong></p></div>
        ${missingCatalog ? `<p class="error">Catalog component missing: ${missingItems.map((line) => escapeHtml(line.id)).join(', ')}. Add that item to data/catalog.json.</p>` : ''}
        <div class="pc-package-actions"><button type="button" class="btn" data-circuit-buy="${escapeHtml(project.id)}" ${missingCatalog ? 'disabled' : ''}>Buy complete kit · save ${formatPrice(retail - discounted)}</button><button type="button" class="btn btn-secondary" data-circuit-missing="${escapeHtml(project.id)}" ${!missingLines.length || missingCatalog ? 'disabled' : ''}>${missingLines.length ? 'Buy missing components · no discount' : 'You already have all required parts'}</button><button type="button" class="btn btn-secondary" data-circuit-build="${escapeHtml(project.id)}" ${canBuild ? '' : 'disabled'}>${canBuild ? 'Build set from inventory' : 'Build set · need selected parts'}</button></div>
        <p class="pc-package-footnote">Buying the complete kit stores it as one circuit set. You can disassemble it from Inventory to recover the catalog packs.</p>
      </article>`
    }).join('')
  }
  builder.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-circuit-option]')
    if (!checkbox) return
    const values = new Set(currentOptions(CIRCUIT_PACKAGES.find((p) => p.id === checkbox.dataset.circuitOption)))
    if (checkbox.checked) values.add(checkbox.value); else values.delete(checkbox.value)
    selections.set(checkbox.dataset.circuitOption, [...values])
    render()
  })
  builder.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-circuit-buy],[data-circuit-missing],[data-circuit-build]')
    if (!button) return
    const project = CIRCUIT_PACKAGES.find((item) => item.id === button.dataset.circuitBuy || item.id === button.dataset.circuitMissing || item.id === button.dataset.circuitBuild)
    if (!project) return
    const required = resolveCircuitParts(project, catalog)
    const lines = resolveCircuitParts(project, catalog, currentOptions(project))
    if (lines.some((line) => !line.item)) return showToast('A project part is missing from the catalog.', true)
    if (button.hasAttribute('data-circuit-build')) {
      if (!await confirmInApp({ title: 'Build circuit set from inventory?', message: `Use the required component packs to make one ${project.name} inventory set?`, confirmLabel: 'Build set' })) return
      const result = assembleCircuitSet(project, lines, catalog)
      if (!result.ok) return showToast(result.message, true)
      showToast(`${project.name} built from inventory parts.`)
      location.hash = '#inventory'
    } else if (button.hasAttribute('data-circuit-buy')) {
      if (!addCircuitBundleToCart(lines.map(({ id, packQuantity, physicalQuantity, breakdown }) => ({ catalogId:id, packQuantity, physicalQuantity, breakdown })), project.name, project.id)) return showToast('Sign in before adding a kit to your cart.', true)
      showToast(`${project.name} added to cart with the complete-kit offer.`)
      location.hash = '#cart'
    } else {
      const missing = required.filter((line) => inventoryCount(line.id) < line.packQuantity)
        .flatMap((line) => Array.from({ length: line.packQuantity - inventoryCount(line.id) }, () => line.item))
      if (!addItemsToCart(missing)) return showToast('Sign in before adding components to your cart.', true)
      showToast(`${missing.length} missing catalog pack(s) added at regular prices.`)
      location.hash = '#cart'
    }
  })
  subscribe(render)
  window.addEventListener('pyesa-session-updated', render)
  window.addEventListener('pyesa-balance-updated', render)
  render()
}
