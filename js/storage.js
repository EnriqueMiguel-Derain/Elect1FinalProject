// Saves and loads the inventory using localStorage.
const KEY = 'partshub-inventory'

export function loadParts() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveParts(parts) {
  localStorage.setItem(KEY, JSON.stringify(parts))
}
