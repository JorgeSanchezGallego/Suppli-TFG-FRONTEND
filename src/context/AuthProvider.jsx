import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { login, registro, usuarioActual } from '../api/usuarios.js'

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

  const registrarse = useCallback(
    async (datos) => {
      await registro(datos)
      return iniciarSesion(datos.correo, datos.contraseña)
    },
    [iniciarSesion],
  )

  const cerrarSesion = useCallback(() => {
    guardarSesion(null)
    setSesion(null)
  }, [])

  const token = sesion?.token

  useEffect(() => {
    if (!token) return
    const restante = caducidad(token) - Date.now()
    const temporizador = setTimeout(cerrarSesion, Math.max(restante, 0))
    return () => clearTimeout(temporizador)
  }, [token, cerrarSesion])

  useEffect(() => {
    if (!token) return
    let cancelado = false

    const refrescar = async () => {
      try {
        const usuario = await usuarioActual(token)
        if (cancelado) return
        setSesion((actual) => {
          if (actual?.token !== token) return actual
          const nueva = { ...actual, usuario }
          guardarSesion(nueva)
          return nueva
        })
      } catch (error) {
        if (!cancelado && error.estado === 401) cerrarSesion()
      }
    }

    refrescar()
    window.addEventListener('focus', refrescar)
    return () => {
      cancelado = true
      window.removeEventListener('focus', refrescar)
    }
  }, [token, cerrarSesion])

  const valor = useMemo(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      iniciarSesion,
      registrarse,
      cerrarSesion,
    }),
    [sesion, iniciarSesion, registrarse, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
