// One shared copy of the inventory. Pages subscribe so they update when it changes.
import { getCurrentAccount, loadAccountParts, saveAccountParts } from './accounts.js'

let parts = loadAccountParts()
const listeners = []

export const getParts = () => parts
export const subscribe = (fn) => listeners.push(fn)
export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

export function setParts(next) {
  if (!getCurrentAccount()) return
  parts = next
  saveAccountParts(parts)
  listeners.forEach((fn) => fn(parts))
}

export function reloadAccountParts() {
  parts = loadAccountParts()
  listeners.forEach((fn) => fn(parts))
}

