import { describe, expect, it } from 'vitest'
import { localesParaPedir } from './pedidos.js'

const gomiz = { _id: 'b1', nombre: 'Kiosko Gómiz' }
const noray = { _id: 'b2', nombre: 'Noray' }

describe('localesParaPedir', () => {
  it('sin sesión no se puede pedir desde ningún local', () => {
    expect(localesParaPedir(null)).toEqual([])
  })

  it('el empleado pide desde los locales en los que trabaja', () => {
    expect(localesParaPedir({ role: 'empleado', bares: [gomiz, noray] })).toEqual([gomiz, noray])
  })

  it('un empleado sin local no puede pedir', () => {
    expect(localesParaPedir({ role: 'empleado', bares: [] })).toEqual([])
    expect(localesParaPedir({ role: 'empleado' })).toEqual([])
  })

  it('el encargado pide desde los locales que gestiona, no desde los de empleado', () => {
    const encargado = { role: 'encargado', bares: [gomiz], baresGestionados: [noray] }
    expect(localesParaPedir(encargado)).toEqual([noray])
  })

  it('el proveedor nunca puede pedir', () => {
    expect(localesParaPedir({ role: 'proveedor', bares: [gomiz], baresGestionados: [noray] })).toEqual([])
  })

  it('ignora los locales que aún no se han cargado y solo son un id', () => {
    expect(localesParaPedir({ role: 'empleado', bares: ['b1', noray] })).toEqual([noray])
  })
})
