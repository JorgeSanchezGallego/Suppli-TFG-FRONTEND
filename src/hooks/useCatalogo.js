import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { obtenerProductos } from '../api/productos.js'
import { obtenerProveedores } from '../api/proveedores.js'

export function useCatalogo() {
  const { token } = useAuth()
  const [productos, setProductos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false
    Promise.all([obtenerProductos(token), obtenerProveedores(token)])
      .then(([listaProductos, listaProveedores]) => {
        if (cancelado) return
        setProductos(listaProductos)
        setProveedores(listaProveedores)
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
  }, [token])

  const productosPorProveedor = useMemo(() => {
    const mapa = {}
    for (const producto of productos) {
      const id = producto.proveedor?._id
      if (!id) continue
      if (!mapa[id]) mapa[id] = []
      mapa[id].push(producto)
    }
    return mapa
  }, [productos])

  return { productos, proveedores, productosPorProveedor, cargando, error }
}
