import { peticion } from './cliente.js'

export function login(correo, contraseña) {
  return peticion('/usuarios/login', {
    metodo: 'POST',
    cuerpo: { correo, contraseña },
  })
}

export function usuarioActual(token) {
  return peticion('/usuarios/yo', { token })
}

export function obtenerEmpleados(token) {
  return peticion('/usuarios?role=empleado', { token })
}

export function obtenerEncargados(token) {
  return peticion('/usuarios?role=encargado', { token })
}

export function obtenerUsuarios(token) {
  return peticion('/usuarios', { token })
}

export function cambiarRol(token, id, { role, proveedor }) {
  return peticion(`/usuarios/${id}/rol`, { metodo: 'PATCH', token, cuerpo: { role, proveedor } })
}

export function registro(datos) {
  return peticion('/usuarios/registro', {
    metodo: 'POST',
    cuerpo: datos,
  })
}
