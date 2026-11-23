import { useCallback, useEffect, useMemo, useState } from 'react'
import { PedidoContext } from './PedidoContext.js'

const vacio = { proveedor: null, lineas: {} }

const clave = (usuarioId) => `suppli-pedido-${usuarioId}`

function leerPedido(usuarioId) {
  if (!usuarioId) return vacio
  try {
    const guardado = JSON.parse(localStorage.getItem(clave(usuarioId)))
    if (guardado?.lineas) return guardado
  } catch {
    return vacio
  }
  return vacio
}

export default function PedidoProvider({ usuarioId, children }) {
  const [pedido, setPedido] = useState(() => leerPedido(usuarioId))

  useEffect(() => {
    if (!usuarioId) return
    try {
      if (Object.keys(pedido.lineas).length > 0) localStorage.setItem(clave(usuarioId), JSON.stringify(pedido))
      else localStorage.removeItem(clave(usuarioId))
    } catch {
      return
    }
  }, [pedido, usuarioId])

  const esDeOtroProveedor = useCallback(
    (producto) =>
      Boolean(pedido.proveedor) &&
      Object.keys(pedido.lineas).length > 0 &&
      pedido.proveedor._id !== producto.proveedor._id,
    [pedido],
  )

  const cambiarCantidad = useCallback((producto, cantidad) => {
    setPedido((actual) => {
      const lineas = { ...actual.lineas }
      if (cantidad > 0) lineas[producto._id] = { producto, cantidad }
      else delete lineas[producto._id]

      const hayLineas = Object.keys(lineas).length > 0
      return { proveedor: hayLineas ? producto.proveedor : null, lineas }
    })
  }, [])

  const vaciar = useCallback(() => setPedido(vacio), [])

  const valor = useMemo(() => {
    const lineas = Object.values(pedido.lineas)
    return {
      proveedor: pedido.proveedor,
      lineas,
      numProductos: lineas.length,
      total: lineas.reduce((suma, { producto, cantidad }) => suma + producto.precio * cantidad, 0),
      cantidadDe: (productoId) => pedido.lineas[productoId]?.cantidad ?? 0,
      esDeOtroProveedor,
      cambiarCantidad,
      vaciar,
    }
  }, [pedido, esDeOtroProveedor, cambiarCantidad, vaciar])

  return <PedidoContext.Provider value={valor}>{children}</PedidoContext.Provider>
}
