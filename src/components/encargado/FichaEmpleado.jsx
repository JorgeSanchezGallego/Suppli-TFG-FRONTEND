import { useState } from 'react'
import { Link } from 'react-router-dom'
import { edad, fechaLarga } from '../../utils/formato.js'
import CambiarRol from './CambiarRol.jsx'

function Dato({ icono, children }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icono}
      </svg>
      <span className="min-w-0 break-words">{children}</span>
    </li>
  )
}

const iconos = {
  correo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  telefono: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  casa: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  tarta: (
    <>
      <path d="M4 20h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7z" />
      <path d="M12 11V7" />
      <path d="M12 4.5v.01" />
    </>
  ),
  alta: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
}

export default function FichaEmpleado({ empleado, misBares, onAñadir, proveedores = [], esYo = false, onCambiado }) {
  const [barElegido, setBarElegido] = useState('')
  const [añadiendo, setAñadiendo] = useState(false)
  const [error, setError] = useState('')

  const nombre = [empleado.nombre, empleado.apellidos].filter(Boolean).join(' ')
  const esEmpleado = empleado.role === 'empleado'
  const esEncargado = empleado.role === 'encargado'
  const susBares = (esEncargado ? empleado.baresGestionados : empleado.bares ?? []).filter((b) => typeof b === 'object')
  const idsSuyos = new Set(susBares.map((b) => b._id))
  const idsMios = new Set(misBares.map((b) => b._id))
  const muestraLocales = esEmpleado || esEncargado
  const disponibles = muestraLocales && !esYo ? misBares.filter((b) => !idsSuyos.has(b._id)) : []
  const años = edad(empleado.fechaNacimiento)

  const añadir = async () => {
    if (!barElegido) return
    setAñadiendo(true)
    setError('')
    try {
      await onAñadir(empleado, barElegido)
      setBarElegido('')
    } catch (e) {
      setError(e.message)
    } finally {
      setAñadiendo(false)
    }
  }

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)] md:p-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-terracota/10 text-lg font-semibold text-terracota"
        >
          {empleado.nombre?.charAt(0)}
          {empleado.apellidos?.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-snug font-semibold">{nombre}</h3>
          {!esEmpleado && (
            <span className="mt-1 inline-block rounded-full bg-cafe px-2.5 py-0.5 text-xs font-semibold text-crema">
              {esEncargado ? 'Encargado' : `Proveedor${empleado.proveedor?.nombre_empresa ? ` · ${empleado.proveedor.nombre_empresa}` : ''}`}
              {esYo && ' · Tú'}
            </span>
          )}
          {!muestraLocales ? null : susBares.length === 0 ? (
            <span className={`mt-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ${esEncargado ? 'ml-1' : ''}`}>
              {esEncargado ? 'Sin locales' : 'Sin local'}
            </span>
          ) : (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {susBares.map((bar) =>
                idsMios.has(bar._id) ? (
                  <Link
                    key={bar._id}
                    to={`/mis-locales/${bar._id}`}
                    className="rounded-full bg-terracota/10 px-2.5 py-0.5 text-xs font-medium text-terracota-oscuro hover:bg-terracota/20"
                  >
                    {bar.nombre}
                  </Link>
                ) : (
                  <span key={bar._id} className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">
                    {bar.nombre}
                  </span>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-2 text-cafe">
        <Dato icono={iconos.correo}>
          <a href={`mailto:${empleado.correo}`} className="hover:text-terracota">
            {empleado.correo}
          </a>
        </Dato>
        {empleado.telefono && (
          <Dato icono={iconos.telefono}>
            <a href={`tel:${empleado.telefono}`} className="hover:text-terracota">
              {empleado.telefono}
            </a>
          </Dato>
        )}
        {empleado.residencia && <Dato icono={iconos.casa}>Vive en {empleado.residencia}</Dato>}
        {años !== null && (
          <Dato icono={iconos.tarta}>
            {años} años · nació el {fechaLarga(empleado.fechaNacimiento)}
          </Dato>
        )}
        {empleado.createdAt && <Dato icono={iconos.alta}>En Suppli desde el {fechaLarga(empleado.createdAt)}</Dato>}
      </ul>

      {disponibles.length > 0 && (
        <div className="mt-5 border-t border-arena pt-4">
          <label htmlFor={`añadir-${empleado._id}`} className="text-xs font-medium text-cafe-suave">
            {esEncargado ? 'Añadir como encargado a uno de tus locales' : 'Añadir a uno de tus locales'}
          </label>
          <div className="mt-1.5 flex gap-2">
            <select
              id={`añadir-${empleado._id}`}
              value={barElegido}
              onChange={(e) => setBarElegido(e.target.value)}
              className="min-w-0 flex-1 rounded-full border border-arena bg-white px-3 py-2 text-sm text-cafe outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/15"
            >
              <option value="">Elige un local</option>
              {disponibles.map((bar) => (
                <option key={bar._id} value={bar._id}>
                  {bar.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={añadir}
              disabled={!barElegido || añadiendo}
              className="shrink-0 rounded-full bg-terracota px-4 py-2 text-sm font-medium text-crema hover:bg-terracota-oscuro disabled:cursor-not-allowed disabled:opacity-50"
            >
              {añadiendo ? 'Añadiendo…' : 'Añadir'}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
      {!esYo && (
        <div className="mt-4 border-t border-arena pt-4">
          <CambiarRol usuario={empleado} proveedores={proveedores} onCambiado={onCambiado} />
        </div>
      )}
    </article>
  )
}
