// Simple outline icons (24x24). Used by name or by part category.
const PATHS = {
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  board: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1"/><circle cx="16" cy="14" r="1"/><path d="M8 11v3h5M16 13v-3h-3"/>',
  gpu: '<rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="9" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>',
  ram: '<rect x="2" y="7" width="20" height="9" rx="1"/><path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 16v3M10 16v3M14 16v3M18 16v3"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  tower: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6M9 11h6"/><circle cx="12" cy="17" r="1"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 3v6"/>',
  drive: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h6M17 12h.01"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  sensor: '<path d="M10 14V5a2 2 0 014 0v9a4 4 0 11-4 0z"/>',
  resistor: '<path d="M2 12h4l2-4 3 8 3-8 2 4h6"/>',
  inventory: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
}

const BY_CATEGORY = {
  CPU: 'chip', Microcontroller: 'board', Motherboard: 'board', GPU: 'gpu', RAM: 'ram', PSU: 'bolt',
  Case: 'tower', Keyboard: 'keyboard', Mouse: 'mouse', Storage: 'drive', Monitor: 'monitor',
  Sensor: 'sensor', Resistor: 'resistor',
}

export function icon(nameOrCategory, size = 24) {
  const key = PATHS[nameOrCategory] ? nameOrCategory : BY_CATEGORY[nameOrCategory] || 'chip'
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[key]}</svg>`
}
