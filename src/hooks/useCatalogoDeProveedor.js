import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { obtenerProveedor } from '../api/proveedores.js'
import { obtenerProductos } from '../api/productos.js'

export function useCatalogoDeProveedor(proveedorId) {
  const { token } = useAuth()
  const [empresa, setEmpresa] = useState(null)
  const [todos, setTodos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelado = false
    Promise.all([obtenerProveedor(token, proveedorId), obtenerProductos(token)])
      .then(([datosEmpresa, listaProductos]) => {
        if (cancelado) return
        setEmpresa(datosEmpresa)
        setTodos(listaProductos)
        setError('')
      })
      .catch((e) => {
        if (!cancelado) setError(e.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [token, proveedorId, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  const productos = useMemo(
    () => todos.filter((p) => (p.proveedor?._id ?? p.proveedor) === proveedorId),
    [todos, proveedorId],
  )

  return { empresa, productos, cargando, error, recargar }
}
