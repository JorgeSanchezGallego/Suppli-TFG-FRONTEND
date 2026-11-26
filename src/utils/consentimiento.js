import { useSyncExternalStore } from 'react'

const CLAVE = 'suppli-consentimiento'
const EVENTO = 'suppli-consentimiento'

function leer() {
  try {
    return localStorage.getItem(CLAVE)
  } catch {
    return null
  }
}

export function guardarConsentimiento(eleccion) {
  try {
    if (eleccion) localStorage.setItem(CLAVE, eleccion)
    else localStorage.removeItem(CLAVE)
  } catch {
    return
  } finally {
    window.dispatchEvent(new Event(EVENTO))
  }
}

function suscribir(avisar) {
  window.addEventListener(EVENTO, avisar)
  window.addEventListener('storage', avisar)
  return () => {
    window.removeEventListener(EVENTO, avisar)
    window.removeEventListener('storage', avisar)
  }
}

export function useConsentimiento() {
  return useSyncExternalStore(suscribir, leer, () => null)
}
