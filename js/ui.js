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

// Escape user text before putting it in innerHTML (prevents HTML injection).
export function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const formatPrice = (n) => '₱' + n.toLocaleString('en-PH')
