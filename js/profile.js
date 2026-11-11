import { getCurrentAccount, loadAccountProfile, saveAccountProfile } from './accounts.js'

const EMPTY = { name: '', bench: '', email: '', photo: '' }

export function loadProfile() {
  const account = getCurrentAccount()
  return account ? { ...EMPTY, ...loadAccountProfile(account.id) } : { ...EMPTY }
}

export function saveProfile(profile) {
  const account = getCurrentAccount()
  if (account) saveAccountProfile(profile, account.id)
}
