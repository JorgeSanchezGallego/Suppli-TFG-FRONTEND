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

export function registro(datos) {
  return peticion('/usuarios/registro', {
    metodo: 'POST',
    cuerpo: datos,
  })
}
