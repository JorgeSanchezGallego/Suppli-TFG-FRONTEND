import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  contraseñaLogin,
  contraseñaNueva,
  correo,
  fechaNacimiento,
  limpiarTelefono,
  obligatorio,
  repetirContraseña,
  sinErrores,
  telefono,
  validarFoto,
} from './validaciones.js'

describe('obligatorio', () => {
  it('devuelve el mensaje si el campo está vacío o solo tiene espacios', () => {
    expect(obligatorio('', 'Falta el nombre')).toBe('Falta el nombre')
    expect(obligatorio('   ', 'Falta el nombre')).toBe('Falta el nombre')
  })

  it('no devuelve error si hay texto', () => {
    expect(obligatorio('Ana', 'Falta el nombre')).toBeUndefined()
  })
})

describe('correo', () => {
  it('acepta un correo válido, aunque tenga espacios alrededor', () => {
    expect(correo('empleado1@suppli.test')).toBeUndefined()
    expect(correo('  ana@correo.es  ')).toBeUndefined()
  })

  it('pide el correo si está vacío', () => {
    expect(correo('')).toBe('Escribe tu correo electrónico.')
  })

  it('rechaza correos sin @, sin dominio o con espacios', () => {
    expect(correo('ana.correo.es')).toBe('Ese correo no tiene un formato válido.')
    expect(correo('ana@correo')).toBe('Ese correo no tiene un formato válido.')
    expect(correo('ana garcia@correo.es')).toBe('Ese correo no tiene un formato válido.')
  })
})

describe('contraseñaLogin', () => {
  it('pide la contraseña si está vacía', () => {
    expect(contraseñaLogin('')).toBe('Escribe tu contraseña.')
  })

  it('exige al menos 8 caracteres', () => {
    expect(contraseñaLogin('1234567')).toBe('La contraseña tiene al menos 8 caracteres.')
    expect(contraseñaLogin('Prueba1234')).toBeUndefined()
  })
})

describe('contraseñaNueva', () => {
  it('exige longitud mínima, una mayúscula y un número, en ese orden', () => {
    expect(contraseñaNueva('')).toBe('Elige una contraseña.')
    expect(contraseñaNueva('Abc1')).toBe('Tiene que tener al menos 8 caracteres.')
    expect(contraseñaNueva('prueba1234')).toBe('Añade al menos una letra mayúscula.')
    expect(contraseñaNueva('PruebaSuppli')).toBe('Añade al menos un número.')
  })

  it('acepta una contraseña que cumple todas las reglas', () => {
    expect(contraseñaNueva('Prueba1234')).toBeUndefined()
  })
})

describe('repetirContraseña', () => {
  it('comprueba que coincide con la original', () => {
    expect(repetirContraseña('', 'Prueba1234')).toBe('Repite la contraseña.')
    expect(repetirContraseña('Prueba12345', 'Prueba1234')).toBe('Las contraseñas no coinciden.')
    expect(repetirContraseña('Prueba1234', 'Prueba1234')).toBeUndefined()
  })
})

describe('telefono', () => {
  it('quita espacios y guiones al limpiarlo', () => {
    expect(limpiarTelefono('611 00 00-01')).toBe('611000001')
  })

  it('acepta móviles y fijos españoles, con o sin prefijo', () => {
    expect(telefono('611000001')).toBeUndefined()
    expect(telefono('965 21 57 47')).toBeUndefined()
    expect(telefono('+34 611 000 001')).toBeUndefined()
    expect(telefono('0034611000001')).toBeUndefined()
  })

  it('rechaza números que no son españoles de 9 cifras', () => {
    expect(telefono('')).toBe('Escribe tu teléfono.')
    expect(telefono('61100000')).toBe('Escribe un teléfono español de 9 cifras.')
    expect(telefono('511000001')).toBe('Escribe un teléfono español de 9 cifras.')
    expect(telefono('+44 611000001')).toBe('Escribe un teléfono español de 9 cifras.')
  })
})

describe('fechaNacimiento', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 26, 12, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('pide la fecha y rechaza fechas no válidas', () => {
    expect(fechaNacimiento('')).toBe('Indica tu fecha de nacimiento.')
    expect(fechaNacimiento('no-es-una-fecha')).toBe('Esa fecha no es válida.')
  })

  it('exige al menos 16 años cumplidos', () => {
    expect(fechaNacimiento('2010-11-26')).toBeUndefined()
    expect(fechaNacimiento('2010-11-27')).toBe('Tienes que tener al menos 16 años.')
    expect(fechaNacimiento('2015-01-01')).toBe('Tienes que tener al menos 16 años.')
  })

  it('avisa si la edad es mayor de 100 años', () => {
    expect(fechaNacimiento('1920-01-01')).toBe('Revisa la fecha de nacimiento.')
    expect(fechaNacimiento('1990-05-15')).toBeUndefined()
  })
})

describe('sinErrores', () => {
  it('es verdadero solo si ningún campo tiene error', () => {
    expect(sinErrores({ correo: undefined, telefono: '' })).toBe(true)
    expect(sinErrores({ correo: undefined, telefono: 'Escribe tu teléfono.' })).toBe(false)
  })
})

describe('validarFoto', () => {
  const MB = 1024 * 1024

  it('no da error si no se ha elegido foto', () => {
    expect(validarFoto(null)).toBe('')
  })

  it('acepta jpg, png, gif y webp de hasta 5 MB', () => {
    expect(validarFoto({ type: 'image/jpeg', size: 2 * MB })).toBe('')
    expect(validarFoto({ type: 'image/webp', size: 5 * MB })).toBe('')
  })

  it('rechaza otros formatos y fotos de más de 5 MB', () => {
    expect(validarFoto({ type: 'image/avif', size: MB })).toBe('La foto tiene que ser JPG, PNG, GIF o WEBP.')
    expect(validarFoto({ type: 'image/png', size: 6 * MB })).toBe('La foto no puede pesar más de 5 MB.')
  })
})
