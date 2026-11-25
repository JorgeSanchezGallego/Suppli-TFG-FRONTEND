import { useState } from 'react'
import Campo from '../formulario/Campo.jsx'
import { botonPrimario, tarjeta } from '../estilos.js'
import { limpiarTelefono, obligatorio, sinErrores, telefono } from '../../utils/validaciones.js'
import { capitalizar, normalizar } from '../../utils/formato.js'

const SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

function delSemana(dias = []) {
  const elegidos = new Set(dias.map(normalizar))
  return SEMANA.filter((dia) => elegidos.has(normalizar(dia)))
}

export default function FormularioProveedor({
  inicial,
  onEnviar,
  textoBoton = 'Guardar cambios',
  mensajeOk = 'Cambios guardados.',
  propio = false,
  className = 'mt-8',
}) {
  const [datos, setDatos] = useState({
    nombre_empresa: inicial?.nombre_empresa ?? '',
    nombre_persona: inicial?.nombre_persona ?? '',
    telefono: inicial?.telefono ?? '',
  })
  const [dias, setDias] = useState(() => delSemana(inicial?.dias_reparto))
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    setGuardadoOk(false)
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  const alternarDia = (dia) => {
    setDias((actuales) => (actuales.includes(dia) ? actuales.filter((d) => d !== dia) : delSemana([...actuales, dia])))
    setGuardadoOk(false)
    if (errores.dias) setErrores({ ...errores, dias: undefined })
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevos = {
      nombre_empresa: obligatorio(datos.nombre_empresa, 'Escribe el nombre de la empresa.'),
      nombre_persona: obligatorio(datos.nombre_persona, 'Escribe el nombre de la persona de contacto.'),
      telefono: telefono(datos.telefono),
      dias: dias.length === 0 ? 'Elige al menos un día de reparto.' : undefined,
    }
    setErrores(nuevos)
    if (!sinErrores(nuevos)) return

    setGuardando(true)
    setErrorServidor('')
    try {
      const seguir = await onEnviar({
        nombre_empresa: datos.nombre_empresa.trim(),
        nombre_persona: datos.nombre_persona.trim(),
        telefono: limpiarTelefono(datos.telefono.trim()),
        dias_reparto: dias,
      })
      if (seguir === false) return
      setGuardadoOk(true)
      setGuardando(false)
    } catch (error) {
      setErrorServidor(error.message)
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className={`${tarjeta} ${className} p-6 md:p-8`}>
      <div className="grid gap-5 md:grid-cols-2">
        <Campo
          id="nombre_empresa"
          etiqueta="Nombre de la empresa"
          value={datos.nombre_empresa}
          onChange={cambiar}
          error={errores.nombre_empresa}
          className="md:col-span-2"
        />
        <Campo
          id="nombre_persona"
          etiqueta="Persona de contacto"
          value={datos.nombre_persona}
          onChange={cambiar}
          error={errores.nombre_persona}
        />
        <div>
          <Campo
            id="telefono"
            etiqueta="Teléfono de WhatsApp"
            type="tel"
            inputMode="tel"
            value={datos.telefono}
            onChange={cambiar}
            error={errores.telefono}
          />
          {!errores.telefono && (
            <p className="mt-1.5 text-xs text-cafe-suave">A este número llegan los pedidos que envían los bares.</p>
          )}
        </div>

        <fieldset className="md:col-span-2">
          <legend className="mb-1.5 block text-sm font-medium">Días de reparto</legend>
          <div className="flex flex-wrap gap-2">
            {SEMANA.map((dia) => {
              const activo = dias.includes(dia)
              return (
                <button
                  key={dia}
                  type="button"
                  onClick={() => alternarDia(dia)}
                  aria-pressed={activo}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activo ? 'bg-terracota text-crema' : 'bg-white text-cafe-suave ring-1 ring-arena hover:text-cafe'
                  }`}
                >
                  {capitalizar(dia)}
                </button>
              )
            })}
          </div>
          {errores.dias ? (
            <p className="mt-1.5 text-sm text-red-600">{errores.dias}</p>
          ) : (
            <p className="mt-1.5 text-xs text-cafe-suave">{propio ? 'Los bares los ven en tu catálogo para saber cuándo les llega el pedido.' : 'Los bares los ven en su catálogo para saber cuándo les llega el pedido.'}</p>
          )}
        </fieldset>
      </div>

      {errorServidor && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorServidor}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={guardando} className={botonPrimario}>
          {guardando ? 'Guardando…' : textoBoton}
        </button>
        {guardadoOk && (
          <p role="status" className="text-sm font-medium text-emerald-700">
            {mensajeOk}
          </p>
        )}
      </div>
    </form>
  )
}
