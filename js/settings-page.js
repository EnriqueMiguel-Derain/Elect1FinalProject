import { getParts, setParts, subscribe, makeId } from './store.js'
import { ACCENTS, getSettings, updateSettings } from './settings.js'
import { showToast } from './ui.js'

export function initSettings() {
  const swatches = document.getElementById('swatches')
  const themes = document.getElementById('themes')
  const motion = document.getElementById('set-motion')
  const minStock = document.getElementById('set-minstock')
  const summary = document.getElementById('data-summary')
  const importInput = document.getElementById('import-file')

  const renderSwatches = () => {
    swatches.innerHTML = Object.entries(ACCENTS)
      .map(
        ([key, a]) => `
      <button type="button" class="swatch" role="radio" aria-checked="${getSettings().accent === key}" data-accent="${key}" style="--c:${a.accent}">
        <span class="dot" aria-hidden="true"></span>${a.label}
      </button>`
      )
      .join('')
  }
  const THEMES = {
    dark: ['Dark', '#0e1019'],
    light: ['Light', '#f4f6fb'],
    system: ['Match device', 'linear-gradient(90deg, #0e1019 50%, #f4f6fb 50%)'],
  }
  const renderThemes = () => {
    themes.innerHTML = Object.entries(THEMES)
      .map(
        ([key, [label, bg]]) => `
      <button type="button" class="swatch" role="radio" aria-checked="${getSettings().theme === key}" data-theme-opt="${key}" style="--c:${bg}">
        <span class="dot" aria-hidden="true"></span>${label}
      </button>`
      )
      .join('')
  }
  const renderSummary = () => {
    const parts = getParts()
    summary.textContent = `${parts.length} part type(s) saved in this browser.`
  }

  motion.checked = getSettings().motion
  minStock.value = getSettings().minStock
  renderSwatches()
  renderThemes()
  renderSummary()
  subscribe(renderSummary)

  themes.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-theme-opt]')
    if (!btn) return
    updateSettings({ theme: btn.dataset.themeOpt })
    renderThemes()
    renderSwatches()
    showToast(`${THEMES[btn.dataset.themeOpt][0]} theme applied.`)
  })

  swatches.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-accent]')
    if (!btn) return
    updateSettings({ accent: btn.dataset.accent })
    renderSwatches()
    showToast(`${ACCENTS[btn.dataset.accent].label} accent applied.`)
  })

  motion.addEventListener('change', () => {
    updateSettings({ motion: motion.checked })
    showToast(motion.checked ? 'Animations on.' : 'Animations off.')
  })

  minStock.addEventListener('change', () => {
    const value = Number(minStock.value)
    if (!Number.isInteger(value) || value < 0) {
      minStock.value = getSettings().minStock
      showToast('Use a whole number, 0 or more.', true)
      return
    }
    updateSettings({ minStock: value })
    showToast('Default low-stock level saved.')
  })

  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(getParts(), null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'pyesa-inventory.json'
    link.click()
    URL.revokeObjectURL(link.href)
    showToast('Inventory exported.')
  })

  importInput.addEventListener('change', async () => {
    const file = importInput.files[0]
    importInput.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const valid =
        Array.isArray(data) &&
        data.every((p) => p && typeof p.name === 'string' && typeof p.category === 'string' && Number.isInteger(p.quantity) && p.quantity >= 0)
      if (!valid) throw new Error('bad format')
      if (!confirm(`Replace your current inventory with ${data.length} imported part(s)?`)) return
      setParts(
        data.map((p) => ({
          id: p.id || makeId(),
          name: p.name,
          category: p.category,
          quantity: p.quantity,
          minStock: Number.isInteger(p.minStock) ? p.minStock : 0,
          location: typeof p.location === 'string' ? p.location : '',
          ...(p.catalogId ? { catalogId: p.catalogId } : {}),
        }))
      )
      showToast('Inventory imported.')
    } catch {
      showToast('That file is not a valid Pyesa inventory.', true)
    }
  })

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (getParts().length === 0) return showToast('Inventory is already empty.')
    if (confirm('Delete every part from your inventory? This cannot be undone.')) {
      setParts([])
      showToast('Inventory cleared.')
    }
  })
}
