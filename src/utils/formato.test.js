import { describe, expect, it } from 'vitest'
import {
  cantidadConMedida,
  capitalizar,
  diaDeHoy,
  edad,
  euros,
  listaConY,
  normalizar,
  numero,
  repartenHoy,
  temporadaActual,
} from './formato.js'

const sinEspaciosRaros = (texto) => texto.replace(/\s/g, ' ')

describe('euros y numero', () => {
  it('formatea precios en euros con coma decimal', () => {
    expect(sinEspaciosRaros(euros(18.2))).toBe('18,20 €')
    expect(sinEspaciosRaros(euros(0))).toBe('0,00 €')
  })

  it('muestra como mucho dos decimales', () => {
    expect(numero(2)).toBe('2')
    expect(numero(1.5)).toBe('1,5')
    expect(numero(4.556)).toBe('4,56')
  })
})

describe('edad', () => {
  const hoy = new Date(2026, 10, 26)

  it('calcula los años cumplidos', () => {
    expect(edad('1990-05-15', hoy)).toBe(36)
  })

  it('resta un año si todavía no ha llegado el cumpleaños', () => {
    expect(edad('1990-12-01', hoy)).toBe(35)
  })

  it('devuelve null si la fecha no es válida', () => {
    expect(edad('fecha mala', hoy)).toBeNull()
  })
})

describe('capitalizar y normalizar', () => {
  it('pone en mayúscula solo la primera letra', () => {
    expect(capitalizar('miércoles')).toBe('Miércoles')
    expect(capitalizar()).toBe('')
  })

  it('quita tildes, mayúsculas y espacios para comparar textos', () => {
    expect(normalizar('  Cafés Tavira ')).toBe('cafes tavira')
    expect(normalizar('Sábado')).toBe('sabado')
  })
})

describe('temporadaActual', () => {
  it('es verano de abril a septiembre', () => {
    expect(temporadaActual(new Date(2026, 3, 1))).toBe('verano')
    expect(temporadaActual(new Date(2026, 8, 30))).toBe('verano')
  })

  it('es invierno de octubre a marzo', () => {
    expect(temporadaActual(new Date(2026, 9, 1))).toBe('invierno')
    expect(temporadaActual(new Date(2026, 1, 15))).toBe('invierno')
  })
})

describe('listaConY', () => {
  it('une los elementos con comas y una «y» antes del último', () => {
    expect(listaConY(['lunes', 'martes', 'viernes'])).toBe('lunes, martes y viernes')
    expect(listaConY(['martes', 'viernes'])).toBe('martes y viernes')
  })

  it('devuelve el elemento solo, o vacío si no hay ninguno', () => {
    expect(listaConY(['lunes'])).toBe('lunes')
    expect(listaConY([])).toBe('')
  })
})

describe('días de reparto', () => {
  const jueves = new Date(2026, 10, 26)
  const sabado = new Date(2026, 10, 28)

  it('sabe qué día de la semana es', () => {
    expect(diaDeHoy(jueves)).toBe('jueves')
    expect(diaDeHoy(sabado)).toBe('sábado')
  })

  it('detecta si hoy hay reparto, aunque el día venga sin tilde o en mayúscula', () => {
    expect(repartenHoy(['martes', 'jueves'], jueves)).toBe(true)
    expect(repartenHoy(['Sabado'], sabado)).toBe(true)
    expect(repartenHoy(['martes', 'viernes'], jueves)).toBe(false)
    expect(repartenHoy(undefined, jueves)).toBe(false)
  })
})

describe('cantidadConMedida', () => {
  it('deja la medida en singular cuando la cantidad es 1', () => {
    expect(cantidadConMedida(1, 'caja')).toBe('1 caja')
    expect(cantidadConMedida(1, 'unidad')).toBe('1 unidad')
  })

  it('pone en plural la medida según cómo termina la palabra', () => {
    expect(cantidadConMedida(4, 'caja')).toBe('4 cajas')
    expect(cantidadConMedida(3, 'unidad')).toBe('3 unidades')
    expect(cantidadConMedida(2, 'luz')).toBe('2 luces')
  })

  it('no pone en plural las abreviaturas ni el resto de la medida', () => {
    expect(cantidadConMedida(2, 'kg')).toBe('2 kg')
    expect(cantidadConMedida(2, 'bolsa 1kg')).toBe('2 bolsas 1kg')
  })

  it('muestra solo el número si no hay medida', () => {
    expect(cantidadConMedida(5)).toBe('5')
  })
})
