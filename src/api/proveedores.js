import { peticion } from './cliente.js'

export function obtenerProveedores(token) {
  return peticion('/proveedores', { token })
}

export function obtenerProveedor(token, id) {
  return peticion(`/proveedores/${id}`, { token })
}

export function editarProveedor(token, id, datos) {
  return peticion(`/proveedores/${id}`, { metodo: 'PATCH', token, cuerpo: datos })
}

export function crearProveedor(token, datos) {
  return peticion('/proveedores', { metodo: 'POST', token, cuerpo: datos })
}

export function borrarProveedor(token, id) {
  return peticion(`/proveedores/${id}`, { metodo: 'DELETE', token })
}
