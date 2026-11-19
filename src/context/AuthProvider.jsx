import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { login } from '../api/usuarios.js'

const CLAVE = 'suppli-sesion'

function caducidad(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return exp * 1000
  } catch {
    return 0
  }
}

function leerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE))
    if (sesion?.token && caducidad(sesion.token) > Date.now()) return sesion
    localStorage.removeItem(CLAVE)
  } catch {
    return null
  }
  return null
}

function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(CLAVE, JSON.stringify(sesion))
    else localStorage.removeItem(CLAVE)
  } catch {
    return
  }
}

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  const iniciarSesion = useCallback(async (correo, contraseña) => {
    const { user, token } = await login(correo, contraseña)
    const nueva = { usuario: user, token }
    guardarSesion(nueva)
    setSesion(nueva)
    return user
  }, [])

  const cerrarSesion = useCallback(() => {
    guardarSesion(null)
    setSesion(null)
  }, [])

  useEffect(() => {
    if (!sesion) return
    const restante = caducidad(sesion.token) - Date.now()
    const temporizador = setTimeout(cerrarSesion, Math.max(restante, 0))
    return () => clearTimeout(temporizador)
  }, [sesion, cerrarSesion])

  const valor = useMemo(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      iniciarSesion,
      cerrarSesion,
    }),
    [sesion, iniciarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
