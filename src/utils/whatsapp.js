import { cantidadConMedida } from './formato.js'

function saludoSegunHora(fecha = new Date()) {
  const hora = fecha.getHours()
  if (hora < 14) return 'buenos días'
  if (hora < 21) return 'buenas tardes'
  return 'buenas noches'
}

export function mensajePedido({ proveedor, bar, lineas }) {
  const nombre = proveedor?.nombre_persona?.split(' ')[0]
  const saludo = nombre ? `Hola ${nombre}, ${saludoSegunHora()}.` : `Hola, ${saludoSegunHora()}.`
  const lista = lineas.map(({ producto, cantidad }) => `- ${producto.nombre}: ${cantidadConMedida(cantidad, producto.medida)}`)

  return [saludo, `Te escribo desde ${bar.nombre} para hacerte el siguiente pedido:`, '', ...lista].join('\n')
}

export function telefonoInternacional(telefono = '') {
  const digitos = telefono.replace(/\D/g, '')
  if (digitos.startsWith('0034')) return digitos.slice(2)
  if (digitos.length === 9) return `34${digitos}`
  return digitos
}

export function enlaceWhatsApp(telefono, mensaje) {
  return `https://wa.me/${telefonoInternacional(telefono)}?text=${encodeURIComponent(mensaje)}`
}
