import { showToast } from './ui.js'

const dialog = document.getElementById('contact-dialog')
const form = document.getElementById('contact-form')

export function initContact() {
  if (!dialog || !form) return
  document.getElementById('contact-open').addEventListener('click', () => dialog.showModal())
  document.getElementById('contact-close').addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const entry = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
      createdAt: new Date().toISOString(),
    }
    try {
      const messages = JSON.parse(localStorage.getItem('pyesa-contact-messages') || '[]')
      localStorage.setItem('pyesa-contact-messages', JSON.stringify([...messages, entry]))
      form.reset()
      dialog.close()
      showToast('Message saved on this device. It has not been sent.')
    } catch {
      showToast('Unable to save the message in this browser.')
    }
  })
}
