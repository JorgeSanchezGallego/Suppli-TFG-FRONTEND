import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enlaceWhatsApp, mensajePedido, telefonoInternacional } from './whatsapp.js'

const pedido = {
  proveedor: { nombre_empresa: 'Exclusivas Ramírez', nombre_persona: 'Manolo Tajuelo', telefono: '611000002' },
  bar: { nombre: 'Noray' },
  lineas: [
    { producto: { nombre: 'Corona 330ml (caja 24)', medida: 'caja' }, cantidad: 4 },
    { producto: { nombre: 'Cóctel frutos secos R55 1kg', medida: 'unidad' }, cantidad: 1 },
  ],
}

describe('mensajePedido', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('saluda por el nombre de pila del contacto y lista los productos', () => {
    vi.setSystemTime(new Date(2026, 10, 26, 10, 0))
    expect(mensajePedido(pedido)).toBe(
      [
        'Hola Manolo, buenos días.',
        'Te escribo desde Noray para hacerte el siguiente pedido:',
        '',
        '- Corona 330ml (caja 24): 4 cajas',
        '- Cóctel frutos secos R55 1kg: 1 unidad',
      ].join('\n'),
    )
  })

  it('cambia el saludo según la hora', () => {
    vi.setSystemTime(new Date(2026, 10, 26, 13, 59))
    expect(mensajePedido(pedido)).toMatch(/^Hola Manolo, buenos días\./)

    vi.setSystemTime(new Date(2026, 10, 26, 14, 0))
    expect(mensajePedido(pedido)).toMatch(/^Hola Manolo, buenas tardes\./)

    vi.setSystemTime(new Date(2026, 10, 26, 21, 0))
    expect(mensajePedido(pedido)).toMatch(/^Hola Manolo, buenas noches\./)
  })

  it('saluda sin nombre si el proveedor no tiene persona de contacto', () => {
    vi.setSystemTime(new Date(2026, 10, 26, 18, 0))
    const sinContacto = { ...pedido, proveedor: { ...pedido.proveedor, nombre_persona: '' } }
    expect(mensajePedido(sinContacto)).toMatch(/^Hola, buenas tardes\./)
  })
})

describe('telefonoInternacional', () => {
  it('añade el prefijo 34 a los números de 9 cifras', () => {
    expect(telefonoInternacional('611000002')).toBe('34611000002')
    expect(telefonoInternacional('611 00 00 02')).toBe('34611000002')
  })

  it('respeta el prefijo si ya lo tiene, con + o con 0034', () => {
    expect(telefonoInternacional('+34 611000002')).toBe('34611000002')
    expect(telefonoInternacional('0034611000002')).toBe('34611000002')
  })

  it('devuelve vacío si no hay teléfono', () => {
    expect(telefonoInternacional()).toBe('')
  })
})

describe('enlaceWhatsApp', () => {
  it('crea el enlace wa.me con el teléfono y el mensaje codificado', () => {
    const enlace = enlaceWhatsApp('611000002', 'Hola Manolo,\n- Corona: 4 cajas')
    expect(enlace).toBe('https://wa.me/34611000002?text=Hola%20Manolo%2C%0A-%20Corona%3A%204%20cajas')
  })

  it('el mensaje se recupera igual al decodificar el enlace', () => {
    const mensaje = 'Pedido para Noray: 2 cajas de Lanjarón & 1 unidad'
    const texto = new URL(enlaceWhatsApp('611000003', mensaje)).searchParams.get('text')
    expect(texto).toBe(mensaje)
  })
})
