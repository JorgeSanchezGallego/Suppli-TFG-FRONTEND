import { peticion } from './cliente.js'

export function obtenerProveedores(token) {
  return peticion('/proveedores', { token })
}

export function obtenerProveedor(token, id) {
  return peticion(`/proveedores/${id}`, { token })
}
