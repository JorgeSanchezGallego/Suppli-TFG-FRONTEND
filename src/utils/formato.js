const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export const euros = (cantidad) => formatoEuros.format(cantidad)

const formatoNumero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 })

export const numero = (valor) => formatoNumero.format(valor)

const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export const fechaHora = (fecha) => formatoFecha.format(new Date(fecha))

const formatoDia = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' })

export const fechaLarga = (fecha) => formatoDia.format(new Date(fecha))

export function edad(fechaNacimiento, hoy = new Date()) {
  const nacimiento = new Date(fechaNacimiento)
  if (Number.isNaN(nacimiento.getTime())) return null
  let años = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) años--
  return años
}

export const capitalizar =(texto = '') => texto.charAt(0).toUpperCase() + texto.slice(1)

export function temporadaActual(fecha = new Date()) {
  const mes = fecha.getMonth()
  return mes >= 3 && mes <= 8 ? 'verano' : 'invierno'
}

export function listaConY(elementos = []) {
  if (elementos.length <= 1) return elementos.join('')
  return `${elementos.slice(0, -1).join(', ')} y ${elementos.at(-1)}`
}

export const normalizar = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export const diaDeHoy = (fecha = new Date()) => DIAS[fecha.getDay()]

export const repartenHoy = (diasReparto = [], fecha = new Date()) =>
  diasReparto.some((dia) => normalizar(dia) === normalizar(diaDeHoy(fecha)))

const ABREVIATURAS = /^(kg|g|l|cl|ml|ud|uds)$/i

function pluralizarPalabra(palabra) {
  if (ABREVIATURAS.test(palabra)) return palabra
  if (/[aeiouáéó]$/i.test(palabra)) return `${palabra}s`
  if (/z$/i.test(palabra)) return `${palabra.slice(0, -1)}ces`
  return `${palabra}es`
}

export function cantidadConMedida(cantidad, medida = '') {
  if (!medida) return numero(cantidad)
  if (cantidad === 1) return `${numero(cantidad)} ${medida}`
  const [primera, ...resto] = medida.split(' ')
  return `${numero(cantidad)} ${[pluralizarPalabra(primera), ...resto].join(' ')}`
}
