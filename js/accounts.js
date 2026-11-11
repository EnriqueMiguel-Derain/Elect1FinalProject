// Browser-only demo accounts. A real deployment needs a server and secure authentication.
const DATABASE_KEY = 'pyesa-accounts'
const SESSION_KEY = 'pyesa-session'
const LEGACY_PARTS_KEY = 'pyesa-inventory'
const LEGACY_PROFILE_KEY = 'pyesa-profile'
const STARTING_BALANCE = 5000

const DEMO_ACCOUNTS = [
  { id: 'student-enrique', username: 'enrique', password: 'pyesa123', role: 'student', balance: STARTING_BALANCE, profile: { name: 'Enrique Miguel N. Derain', bench: '', email: '', photo: '' }, parts: [], cart: [] },
  { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', balance: STARTING_BALANCE, profile: { name: 'Pyesa Admin', bench: '', email: '', photo: '' }, parts: [], cart: [] },
]

function readDatabase() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATABASE_KEY))
    if (saved?.accounts?.length) {
      const normalized = {
        ...saved,
        accounts: saved.accounts.map((account) => ({
          ...account,
          balance: Number.isFinite(account.balance) ? Math.max(0, account.balance) : STARTING_BALANCE,
          cart: Array.isArray(account.cart) ? account.cart : [],
        })),
      }
      try { localStorage.setItem(DATABASE_KEY, JSON.stringify(normalized)) } catch { /* normalized data remains available for this visit */ }
      return normalized
    }
  } catch { /* start with demo accounts if storage is unavailable or invalid */ }
  const database = { accounts: DEMO_ACCOUNTS.map((account) => ({ ...account, profile: { ...account.profile }, parts: [], cart: [] })) }
  try {
    const legacyParts = JSON.parse(localStorage.getItem(LEGACY_PARTS_KEY) || '[]')
    const legacyProfile = JSON.parse(localStorage.getItem(LEGACY_PROFILE_KEY) || 'null')
    database.accounts[0].parts = Array.isArray(legacyParts) ? legacyParts : []
    if (legacyProfile && typeof legacyProfile === 'object') database.accounts[0].profile = { ...database.accounts[0].profile, ...legacyProfile }
  } catch { /* malformed legacy data is ignored */ }
  try { localStorage.setItem(DATABASE_KEY, JSON.stringify(database)) } catch { /* keep the demo usable for this visit */ }
  return database
}

let database = readDatabase()
let sessionId = (() => {
  try {
    const id = localStorage.getItem(SESSION_KEY)
    return database.accounts.some((account) => account.id === id) ? id : ''
  } catch { return '' }
})()

export const getCurrentAccount = () => database.accounts.find((account) => account.id === sessionId) || null
export const getAccounts = () => database.accounts.map(({ id, username, role, profile }) => ({ id, username, role, profile }))

function writeDatabase(next = database) {
  database = next
  try { localStorage.setItem(DATABASE_KEY, JSON.stringify(database)) } catch { /* keep the current visit usable */ }
}

export function signIn(username, password) {
  const account = database.accounts.find((item) => item.username.toLowerCase() === username.trim().toLowerCase() && item.password === password)
  if (!account) return false
  sessionId = account.id
  try { localStorage.setItem(SESSION_KEY, sessionId) } catch { /* session lasts for this visit */ }
  return true
}

export function signOut() {
  sessionId = ''
  try { localStorage.removeItem(SESSION_KEY) } catch { /* already signed out for this visit */ }
}

export function loadAccountParts(accountId = sessionId) {
  return database.accounts.find((account) => account.id === accountId)?.parts || []
}

export function saveAccountParts(parts, accountId = sessionId) {
  if (!accountId) return
  const account = database.accounts.find((item) => item.id === accountId)
  if (!account) return
  account.parts = parts
  writeDatabase()
}

export function loadAccountCart(accountId = sessionId) {
  return database.accounts.find((account) => account.id === accountId)?.cart || []
}

export function saveAccountCart(cart, accountId = sessionId) {
  if (!accountId) return
  const account = database.accounts.find((item) => item.id === accountId)
  if (!account) return
  account.cart = cart
  writeDatabase()
}

export function loadAccountProfile(accountId = sessionId) {
  return database.accounts.find((account) => account.id === accountId)?.profile || { name: '', bench: '', email: '', photo: '' }
}

export function saveAccountProfile(profile, accountId = sessionId) {
  if (!accountId) return
  const account = database.accounts.find((item) => item.id === accountId)
  if (!account) return
  account.profile = { ...account.profile, ...profile }
  writeDatabase()
}

export function clearAccountInventory(accountId = sessionId) {
  saveAccountParts([], accountId)
}

export function adjustCurrentBalance(amount) {
  const account = getCurrentAccount()
  if (!account || !Number.isFinite(amount) || amount === 0) return null
  const nextBalance = Math.round((account.balance + amount) * 100) / 100
  if (nextBalance < 0) return null
  account.balance = nextBalance
  writeDatabase()
  return nextBalance
}
