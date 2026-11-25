import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { obtenerProveedor } from '../api/proveedores.js'
import { obtenerProductos } from '../api/productos.js'
import { obtenerHistorial } from '../api/pedidos.js'

const idDe = (valor) => (typeof valor === 'object' ? valor?._id : valor)

export function useProveedor() {
  const { usuario, token } = useAuth()
  const empresaId = idDe(usuario?.proveedor)
  const [empresa, setEmpresa] = useState(null)
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [ahora] = useState(() => new Date())

  useEffect(() => {
    if (!empresaId) return
    let cancelado = false
    Promise.all([obtenerProveedor(token, empresaId), obtenerProductos(token), obtenerHistorial(token)])
      .then(([datosEmpresa, listaProductos, listaPedidos]) => {
        if (cancelado) return
        setEmpresa(datosEmpresa)
        setProductos(listaProductos)
        setPedidos(listaPedidos)
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
  }, [token, empresaId, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  const resumen = useMemo(() => {
    const pendientes = pedidos.filter((p) => p.estado === 'pendiente')
    const fecha = (p) => new Date(p.fecha_pedido ?? p.createdAt)
    const delMes = pedidos.filter((p) => {
      const f = fecha(p)
      return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
    })
    const facturadoMes = delMes.reduce((total, p) => total + (p.total ?? 0), 0)
    const locales = new Set(pedidos.map((p) => idDe(p.bar)).filter(Boolean))
    return { pendientes, delMes, facturadoMes, numLocales: locales.size, ultimo: pedidos[0] ?? null }
  }, [pedidos, ahora])

  return { empresa, productos, pedidos, ...resumen, cargando: Boolean(empresaId) && cargando, error, recargar }
}
