import { peticion } from './cliente.js'

export function login(correo, contraseña) {
  return peticion('/usuarios/login', {
    metodo: 'POST',
    cuerpo: { correo, contraseña },
  })
}
