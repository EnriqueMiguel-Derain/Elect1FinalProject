// Local profile saved in localStorage. No password: nothing sensitive is stored.
const KEY = 'pyesa-profile'
const EMPTY = { name: '', bench: '', email: '' }

export function loadProfile() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return { ...EMPTY }
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    /* storage unavailable: profile lasts for this visit only */
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to clear */
  }
}