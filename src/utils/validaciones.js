const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORMATO_TELEFONO = /^(\+34|0034)?[6789]\d{8}$/
const EDAD_MINIMA = 16

export const limpiarTelefono = (telefono) => telefono.replace(/[\s-]/g, '')

export function obligatorio(valor, mensaje) {
  if (!valor.trim()) return mensaje
}

export function correo(valor) {
  if (!valor.trim()) return 'Escribe tu correo electrónico.'
  if (!FORMATO_CORREO.test(valor.trim())) return 'Ese correo no tiene un formato válido.'
}

export function contraseñaLogin(valor) {
  if (!valor) return 'Escribe tu contraseña.'
  if (valor.length < 8) return 'La contraseña tiene al menos 8 caracteres.'
}

export function contraseñaNueva(valor) {
  if (!valor) return 'Elige una contraseña.'
  if (valor.length < 8) return 'Tiene que tener al menos 8 caracteres.'
  if (!/[A-Z]/.test(valor)) return 'Añade al menos una letra mayúscula.'
  if (!/\d/.test(valor)) return 'Añade al menos un número.'
}

export function repetirContraseña(valor, original) {
  if (!valor) return 'Repite la contraseña.'
  if (valor !== original) return 'Las contraseñas no coinciden.'
}

export function telefono(valor) {
  if (!valor.trim()) return 'Escribe tu teléfono.'
  if (!FORMATO_TELEFONO.test(limpiarTelefono(valor))) return 'Escribe un teléfono español de 9 cifras.'
}

export function fechaNacimiento(valor) {
  if (!valor) return 'Indica tu fecha de nacimiento.'
  const nacimiento = new Date(valor)
  if (Number.isNaN(nacimiento.getTime())) return 'Esa fecha no es válida.'

  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const aunNoHaCumplido =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())
  if (aunNoHaCumplido) edad--

  if (edad < EDAD_MINIMA) return `Tienes que tener al menos ${EDAD_MINIMA} años.`
  if (edad > 100) return 'Revisa la fecha de nacimiento.'
}

export function sinErrores(errores) {
  return Object.values(errores).every((error) => !error)
}
