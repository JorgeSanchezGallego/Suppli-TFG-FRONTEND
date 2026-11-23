import { peticion } from './cliente.js'

export function obtenerProductos(token) {
  return peticion('/productos', { token })
}
