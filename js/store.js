// One shared copy of the inventory. Pages subscribe so they update when it changes.
import { loadParts, saveParts } from './storage.js'
import { getSettings } from './settings.js'

let parts = loadParts()
const listeners = []

export const getParts = () => parts
export const subscribe = (fn) => listeners.push(fn)
export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

export function setParts(next) {
  parts = next
  saveParts(parts)
  listeners.forEach((fn) => fn(parts))
}

// Used by "Add to Inventory" buttons: +1 if already owned, otherwise create it.
export function addFromCatalog(item) {
  const owned = parts.find((p) => p.catalogId === item.id)
  if (owned) {
    setParts(parts.map((p) => (p.id === owned.id ? { ...p, quantity: p.quantity + 1 } : p)))
  } else {
    setParts([...parts, { id: makeId(), catalogId: item.id, name: item.name, category: item.category, quantity: 1, minStock: getSettings().minStock, location: '' }])
  }
}
