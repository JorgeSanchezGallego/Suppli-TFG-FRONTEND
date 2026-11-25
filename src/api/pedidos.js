import { peticion } from './cliente.js'

export function crearPedido(token, { proveedor, bar, lineas }) {
  return peticion('/pedidos', {
    metodo: 'POST',
    token,
    cuerpo: {
      proveedor,
      bar,
      productos: lineas.map(({ producto, cantidad }) => ({ producto: producto._id, cantidad })),
    },
  })
}

export function obtenerHistorial(token) {
  return peticion('/pedidos/historial', { token })
}

export function cambiarEstadoPedido(token, id, estado) {
  return peticion(`/pedidos/${id}/estado`, { metodo: 'PATCH', token, cuerpo: { estado } })
}

export function borrarPedido(token, id) {
  return peticion(`/pedidos/${id}`, { metodo: 'DELETE', token })
}
