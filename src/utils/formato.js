const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export const euros = (cantidad) => formatoEuros.format(cantidad)

export const capitalizar = (texto = '') => texto.charAt(0).toUpperCase() + texto.slice(1)

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

export const pasoCantidad = (medida = '') => (/\b(kg|l|litros?)\b/i.test(medida) ? 0.5 : 1)
