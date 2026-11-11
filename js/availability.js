// Stock status for one inventory item (Inventory page).
export function getStockStatus(quantity, minStock) {
  if (quantity <= 0) return 'out'
  if (quantity <= minStock) return 'low'
  return 'ok'
}

// Availability of a part for a project/build that needs qtyNeeded.
// Will be reused by BOMs, the PC Builder, and the shopping list.
export function getAvailability(owned, qtyNeeded, minStock = 0) {
  if (owned < qtyNeeded) return { status: 'short', shortBy: qtyNeeded - owned }
  if (owned - qtyNeeded < minStock) return { status: 'low', shortBy: 0 }
  return { status: 'enough', shortBy: 0 }
}
