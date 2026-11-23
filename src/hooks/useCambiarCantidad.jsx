import { useState } from 'react'
import { usePedido } from '../context/usePedido.js'
import AvisoCambioProveedor from '../components/catalogo/AvisoCambioProveedor.jsx'

export function useCambiarCantidad() {
  const pedido = usePedido()
  const [pendiente, setPendiente] = useState(null)

  const cambiarCantidad = (producto, cantidad) => {
    if (cantidad > 0 && pedido.esDeOtroProveedor(producto)) {
      setPendiente({ producto, cantidad })
      return
    }
    pedido.cambiarCantidad(producto, cantidad)
  }

  const cambiarDeProveedor = () => {
    pedido.vaciar()
    pedido.cambiarCantidad(pendiente.producto, pendiente.cantidad)
    setPendiente(null)
  }

  const aviso = pendiente && (
    <AvisoCambioProveedor
      actual={pedido.proveedor?.nombre_empresa}
      nuevo={pendiente.producto.proveedor?.nombre_empresa}
      onSeguir={() => setPendiente(null)}
      onCambiar={cambiarDeProveedor}
    />
  )

  return { cambiarCantidad, aviso }
}
