import { createSupabaseClient } from './supabase-client.js'

const TABLE = 'pyesa_accounts'
const STARTING_BALANCE = 5000
let client = null
let currentAccount = null
let saveQueue = Promise.resolve()

const blankProfile = () => ({ name: '', bench: '', email: '', photo: '' })

export function isAccountServiceConfigured() {
  return Boolean(window.PYESA_SUPABASE_CONFIG?.url && window.PYESA_SUPABASE_CONFIG?.publishableKey)
}

function makeAccount(user, row = {}) {
  const metadata = user.user_metadata || {}
  return {
    id: user.id,
    username: user.email || '',
    email: user.email || '',
    role: user.app_metadata?.pyesa_role === 'admin' ? 'admin' : 'student',
    balance: Number.isFinite(Number(row.balance)) ? Number(row.balance) : STARTING_BALANCE,
    profile: { ...blankProfile(), name: metadata.display_name || '', email: user.email || '', ...(row.profile || {}) },
    parts: Array.isArray(row.parts) ? row.parts : [],
    cart: Array.isArray(row.cart) ? row.cart : [],
  }
}

async function loadAccount(user) {
  const { data, error } = await client.from(TABLE).select('profile, parts, cart, balance').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  let row = data
  if (!row) {
    row = { profile: { ...blankProfile(), name: user.user_metadata?.display_name || '', email: user.email || '' }, parts: [], cart: [], balance: STARTING_BALANCE }
    const { error: createError } = await client.from(TABLE).insert({ user_id: user.id, ...row })
    if (createError) throw createError
  }
  currentAccount = makeAccount(user, row)
  return currentAccount
}

export async function initializeAccounts() {
  client = await createSupabaseClient()
  if (!client) return false
  const { data: { session }, error } = await client.auth.getSession()
  if (error) throw error
  if (session?.user) await loadAccount(session.user)
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session?.user) currentAccount = null
  })
  return true
}

export const getCurrentAccount = () => currentAccount
export const getAccounts = () => currentAccount ? [{ id: currentAccount.id, username: currentAccount.username, role: currentAccount.role, profile: currentAccount.profile }] : []

function persistAccount() {
  if (!client || !currentAccount) return
  const account = currentAccount
  const row = {
    user_id: account.id,
    profile: account.profile,
    parts: account.parts,
    cart: account.cart,
    balance: account.balance,
  }
  saveQueue = saveQueue.catch(() => {}).then(async () => {
    const { error } = await client.from(TABLE).upsert(row, { onConflict: 'user_id' })
    if (error) throw error
  }).catch((error) => {
    console.error('Unable to save account data:', error)
    window.dispatchEvent(new CustomEvent('pyesa-cloud-save-error'))
  })
}

export async function signIn(email, password) {
  if (!client) throw new Error('Account service is not configured yet. Add the Supabase project settings first.')
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password })
  if (error) throw error
  await loadAccount(data.user)
  return true
}

export async function signUp({ name, email, password }) {
  if (!client) throw new Error('Account service is not configured yet. Add the Supabase project settings first.')
  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { display_name: name.trim() } },
  })
  if (error) throw error
  if (data.session && data.user) await loadAccount(data.user)
  return { needsEmailConfirmation: !data.session }
}

export async function signOut() {
  await saveQueue
  if (client) {
    const { error } = await client.auth.signOut()
    if (error) throw error
  }
  currentAccount = null
}

export function loadAccountParts(accountId = currentAccount?.id) {
  return accountId && accountId === currentAccount?.id ? currentAccount.parts : []
}

export function saveAccountParts(parts, accountId = currentAccount?.id) {
  if (!currentAccount || accountId !== currentAccount.id) return
  currentAccount.parts = parts
  persistAccount()
}

export function loadAccountCart(accountId = currentAccount?.id) {
  return accountId && accountId === currentAccount?.id ? currentAccount.cart : []
}

export function saveAccountCart(cart, accountId = currentAccount?.id) {
  if (!currentAccount || accountId !== currentAccount.id) return
  currentAccount.cart = cart
  persistAccount()
}

export function loadAccountProfile(accountId = currentAccount?.id) {
  return accountId && accountId === currentAccount?.id ? currentAccount.profile : blankProfile()
}

export function saveAccountProfile(profile, accountId = currentAccount?.id) {
  if (!currentAccount || accountId !== currentAccount.id) return
  currentAccount.profile = { ...currentAccount.profile, ...profile }
  persistAccount()
}

export function clearAccountInventory(accountId = currentAccount?.id) {
  saveAccountParts([], accountId)
}

export function adjustCurrentBalance(amount) {
  if (!currentAccount || !Number.isFinite(amount) || amount === 0) return null
  const nextBalance = Math.round((currentAccount.balance + amount) * 100) / 100
  if (nextBalance < 0) return null
  currentAccount.balance = nextBalance
  persistAccount()
  return nextBalance
}
