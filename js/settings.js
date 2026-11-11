// Site settings saved in localStorage. Applied to the page as CSS variables / a root class.
const KEY = 'pyesa-settings'

export const ACCENTS = {
  indigo: { label: 'Indigo', accent: '#4f46e5', hover: '#6366f1', soft: '#a5b4fc', rgb: '79, 70, 229', softRgb: '165, 180, 252', glow: 'rgba(99, 102, 241, 0.55)' },
  emerald: { label: 'Emerald', accent: '#047857', hover: '#059669', soft: '#6ee7b7', rgb: '4, 120, 87', softRgb: '110, 231, 183', glow: 'rgba(16, 185, 129, 0.5)' },
  rose: { label: 'Rose', accent: '#e11d48', hover: '#f43f5e', soft: '#fda4af', rgb: '225, 29, 72', softRgb: '253, 164, 175', glow: 'rgba(244, 63, 94, 0.5)' },
  cyan: { label: 'Cyan', accent: '#0e7490', hover: '#0891b2', soft: '#67e8f9', rgb: '14, 116, 144', softRgb: '103, 232, 249', glow: 'rgba(6, 182, 212, 0.5)' },
}

const DEFAULTS = { accent: 'indigo', motion: true, minStock: 1 }

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return { ...DEFAULTS }
  }
}

let settings = load()

export const getSettings = () => settings

// Motion is on only if the person wants it AND their system does not ask for reduced motion.
export const motionEnabled = () =>
  settings.motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function applySettings() {
  const a = ACCENTS[settings.accent] || ACCENTS.indigo
  const root = document.documentElement
  root.style.setProperty('--accent', a.accent)
  root.style.setProperty('--accent-hover', a.hover)
  root.style.setProperty('--accent-soft', a.soft)
  root.style.setProperty('--accent-rgb', a.rgb)
  root.style.setProperty('--soft-rgb', a.softRgb)
  root.style.setProperty('--glow', a.glow)
  root.classList.toggle('no-motion', !motionEnabled())
}

export function updateSettings(patch) {
  settings = { ...settings, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    /* storage unavailable: keep settings for this visit only */
  }
  applySettings()
}

applySettings()
