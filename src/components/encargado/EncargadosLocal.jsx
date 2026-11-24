import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import { añadirEncargado, quitarEncargado } from '../../api/bares.js'
import { obtenerEncargados } from '../../api/usuarios.js'
import { tarjeta } from '../estilos.js'

export default function EncargadosLocal({ bar, onCambio }) {
  const { usuario, token } = useAuth()
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [elegido, setElegido] = useState('')
  const [confirmando, setConfirmando] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false
    obtenerEncargados(token)
      .then((lista) => {
        if (!cancelado) setTodos(lista)
      })
      .catch((e) => {
        if (!cancelado) setError(e.message)
      })
    return () => {
      cancelado = true
    }
  }, [token])

  const encargados = (bar.encargados ?? []).filter((e) => typeof e === 'object')
  const ids = new Set(encargados.map((e) => e._id))
  const disponibles = todos.filter((e) => !ids.has(e._id))
  const soloUno = encargados.length === 1

  const ejecutar = async (accion, despues) => {
    setOcupado(true)
    setError('')
    try {
      await accion()
      setConfirmando(null)
      setElegido('')
      despues()
    } catch (e) {
      setError(e.message)
    } finally {
      setOcupado(false)
    }
  }

  const quitar = (encargado) => {
    const soyYo = encargado._id === usuario._id
    ejecutar(
      () => quitarEncargado(token, bar._id, encargado._id),
      soyYo ? () => navigate('/mis-locales', { replace: true }) : onCambio,
    )
  }

  return (
    <div className={`${tarjeta} mt-8 p-6 md:p-8`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">Encargados del local</h2>
        <p className="text-sm text-cafe-suave">Todos pueden gestionar el local con los mismos permisos.</p>
      </div>

      <ul className="mt-3 divide-y divide-arena">
        {encargados.map((encargado) => {
          const soyYo = encargado._id === usuario._id
          const nombre = [encargado.nombre, encargado.apellidos].filter(Boolean).join(' ')
          return (
            <li key={encargado._id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-cafe text-sm font-semibold text-crema"
              >
                {encargado.nombre?.charAt(0)}
                {encargado.apellidos?.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {nombre}
                  {soyYo && (
                    <span className="ml-2 rounded-full bg-terracota/10 px-2 py-0.5 text-xs font-semibold text-terracota">Tú</span>
                  )}
                </p>
                <p className="truncate text-sm text-cafe-suave">
                  {encargado.correo}
                  {encargado.telefono && <> · {encargado.telefono}</>}
                </p>
              </div>

              {!soloUno && (
                <div className="w-full pl-14 sm:w-auto sm:pl-0">
                {confirmando === encargado._id ? (
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => quitar(encargado)}
                      disabled={ocupado}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {ocupado ? 'Quitando…' : soyYo ? 'Sí, dejarlo' : 'Sí, quitar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(null)}
                      className="rounded-full px-3 py-2 text-sm font-medium text-cafe-suave hover:bg-arena/40"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmando(encargado._id)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave ring-1 ring-arena hover:text-red-600 hover:ring-red-200"
                  >
                    {soyYo ? 'Dejar de gestionarlo' : 'Quitar'}
                  </button>
                )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {soloUno && (
        <p className="mt-2 text-sm text-cafe-suave">
          Eres el único encargado. Para dejar este local, añade antes a otro encargado.
        </p>
      )}

      <div className="mt-5 border-t border-arena pt-5">
        <label htmlFor="nuevo-encargado" className="text-sm font-medium">
          Añadir otro encargado
        </label>
        {disponibles.length === 0 ? (
          <p className="mt-1.5 text-sm text-cafe-suave">No hay más encargados registrados en Suppli.</p>
        ) : (
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <select
              id="nuevo-encargado"
              value={elegido}
              onChange={(e) => setElegido(e.target.value)}
              className="min-w-0 flex-1 rounded-full border border-arena bg-white px-4 py-2.5 text-sm text-cafe outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/15"
            >
              <option value="">Elige un encargado</option>
              {disponibles.map((e) => (
                <option key={e._id} value={e._id}>
                  {[e.nombre, e.apellidos].filter(Boolean).join(' ')} · {e.correo}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!elegido || ocupado}
              onClick={() => ejecutar(() => añadirEncargado(token, bar._id, elegido), onCambio)}
              className="rounded-full bg-terracota px-5 py-2.5 text-sm font-medium text-crema hover:bg-terracota-oscuro disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ocupado && elegido ? 'Añadiendo…' : 'Añadir encargado'}
            </button>
          </div>
        )}
        <p className="mt-2 text-xs text-cafe-suave">
          Solo aparecen usuarios con rol de encargado. Si alguien aún no lo es, primero hay que cambiarle el rol.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
