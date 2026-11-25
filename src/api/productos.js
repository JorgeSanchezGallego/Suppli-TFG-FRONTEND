import { peticion } from './cliente.js'

function formulario(campos) {
  const datos = new FormData()
  for (const [clave, valor] of Object.entries(campos)) {
    if (valor !== undefined && valor !== null) datos.append(clave, valor)
  }
  return datos
}

export function obtenerProductos(token) {
  return peticion('/productos', { token })
}

export function crearProducto(token, campos) {
  return peticion('/productos', { metodo: 'POST', token, cuerpo: formulario(campos) })
}

export function editarProducto(token, id, campos) {
  return peticion(`/productos/${id}`, { metodo: 'PATCH', token, cuerpo: formulario(campos) })
}

export function borrarProducto(token, id) {
  return peticion(`/productos/${id}`, { metodo: 'DELETE', token })
}
