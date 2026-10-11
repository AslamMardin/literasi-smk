import { ref } from 'vue'

const installPrompt = ref(null)
let initialized = false

export function initializePwaInstall() {
  if (initialized) return
  initialized = true

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt.value = event
  })
  window.addEventListener('appinstalled', () => {
    installPrompt.value = null
  })
}

export async function promptPwaInstall() {
  if (!installPrompt.value) return null

  const prompt = installPrompt.value
  installPrompt.value = null
  await prompt.prompt()
  return (await prompt.userChoice).outcome
}

export { installPrompt }
