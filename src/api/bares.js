import { peticion } from './cliente.js'

export function obtenerMisBares(token) {
  return peticion('/bares', { token })
}

function formulario(campos) {
  const datos = new FormData()
  for (const [clave, valor] of Object.entries(campos)) {
    if (valor !== undefined && valor !== null) datos.append(clave, valor)
  }
  return datos
}

export function crearBar(token, { nombre, ubicacion, imagen }) {
  return peticion('/bares', { metodo: 'POST', token, cuerpo: formulario({ nombre, ubicacion, imagen }) })
}

export function renombrarBar(token, id, nombre) {
  return peticion(`/bares/${id}`, { metodo: 'PATCH', token, cuerpo: { nombre } })
}

export function cambiarFotoBar(token, id, imagen) {
  return peticion(`/bares/${id}`, { metodo: 'PATCH', token, cuerpo: formulario({ imagen }) })
}

export function borrarBar(token, id) {
  return peticion(`/bares/${id}`, { metodo: 'DELETE', token })
}

export function añadirEmpleado(token, barId, usuarioId) {
  return peticion(`/bares/${barId}/empleados`, { metodo: 'POST', token, cuerpo: { usuarioId } })
}

export function quitarEmpleado(token, barId, usuarioId) {
  return peticion(`/bares/${barId}/empleados/${usuarioId}`, { metodo: 'DELETE', token })
}

export function añadirEncargado(token, barId, usuarioId) {
  return peticion(`/bares/${barId}/encargados`, { metodo: 'POST', token, cuerpo: { usuarioId } })
}

export function quitarEncargado(token, barId, usuarioId) {
  return peticion(`/bares/${barId}/encargados/${usuarioId}`, { metodo: 'DELETE', token })
}
