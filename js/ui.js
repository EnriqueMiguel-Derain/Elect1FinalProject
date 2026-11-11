// Small helpers shared by all pages.
let toastTimer

export function showToast(message, isError = false) {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.classList.toggle('error', isError)
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200)
}

export function confirmInApp({ title, message, confirmLabel = 'Confirm', danger = false }) {
  const dialog = document.getElementById('confirm-dialog')
  if (!dialog) return Promise.resolve(false)
  dialog.querySelector('#confirm-title').textContent = title
  dialog.querySelector('#confirm-message').textContent = message
  const action = dialog.querySelector('#confirm-action')
  action.textContent = confirmLabel
  action.classList.toggle('btn-danger', danger)
  action.classList.toggle('btn-secondary', !danger)

  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true })
    dialog.showModal()
  })
}

// Escape user text before putting it in innerHTML (prevents HTML injection).
export function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const formatPrice = (n) => (n == null ? 'Price not set' : '₱' + n.toLocaleString('en-PH'))
