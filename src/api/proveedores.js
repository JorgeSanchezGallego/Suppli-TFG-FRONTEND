import { peticion } from './cliente.js'

export function obtenerProveedores(token) {
  return peticion('/proveedores', { token })
}
