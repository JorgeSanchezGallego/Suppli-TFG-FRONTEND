import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useEncargado } from '../hooks/useEncargado.js'
import { añadirEmpleado, borrarBar, quitarEmpleado, renombrarBar } from '../api/bares.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import FilaEmpleado from '../components/encargado/FilaEmpleado.jsx'
import ConfirmarBorrado from '../components/encargado/ConfirmarBorrado.jsx'
import CambiarFoto from '../components/encargado/CambiarFoto.jsx'
import EncargadosLocal from '../components/encargado/EncargadosLocal.jsx'
import { fotoDelLocal } from '../data/locales.js'
import { botonPrimario, botonSecundario, tarjeta } from '../components/estilos.js'
import { normalizar } from '../utils/formato.js'
import Volver from '../components/Volver.jsx'

const MAX_RESULTADOS = 8

function CambiarNombre({ bar, onGuardado }) {
  const { token } = useAuth()
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(bar.nombre)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const guardar = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError('El nombre no puede quedar vacío.')
      return
    }
    setGuardando(true)
    try {
      await renombrarBar(token, bar._id, nombre.trim())
      setEditando(false)
      setError('')
      onGuardado()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (!editando) {
    return (
      <button
        type="button"
        onClick={() => {
          setNombre(bar.nombre)
          setEditando(true)
        }}
        className="inline-flex items-center gap-2 rounded-full bg-crema/10 px-5 py-2.5 text-sm font-medium text-crema ring-1 ring-crema/30 transition hover:bg-crema/20"
      >
        Cambiar nombre
      </button>
    )
  }

  return (
    <form onSubmit={guardar} className="flex w-full max-w-lg flex-col gap-2 sm:flex-row">
      <label htmlFor="nuevo-nombre" className="sr-only">
        Nuevo nombre
      </label>
      <input
        id="nuevo-nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        autoFocus
        className="flex-1 rounded-full border border-crema/30 bg-white px-4 py-2.5 text-cafe outline-none focus:ring-4 focus:ring-terracota/30"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className={`${botonPrimario} py-2.5`}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="rounded-full px-4 py-2.5 text-sm font-medium text-crema ring-1 ring-crema/30 hover:bg-crema/10"
        >
          Cancelar
        </button>
      </div>
      {error && <p className="text-sm text-red-200 sm:basis-full">{error}</p>}
    </form>
  )
}

export default function DetalleLocal() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const { bares, empleados, empleadosPorBar, pendientesPorBar, pedidos, cargando, error, recargar } = useEncargado()

  const [busqueda, setBusqueda] = useState('')
  const [ocupado, setOcupado] = useState(null)
  const [quitandoId, setQuitandoId] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const [borrando, setBorrando] = useState(false)

  const bar = bares.find((b) => b._id === id)
  const delLocal = useMemo(() => empleadosPorBar[id] ?? [], [empleadosPorBar, id])
  const idsDelLocal = useMemo(() => new Set(delLocal.map((e) => e._id)), [delLocal])

  const resultados = useMemo(() => {
    const texto = normalizar(busqueda)
    const coinciden = texto
      ? empleados.filter((e) =>
          normalizar(`${e.nombre} ${e.apellidos} ${e.correo}`).includes(texto),
        )
      : empleados.filter((e) => (e.bares ?? []).length === 0)
    return coinciden.slice(0, MAX_RESULTADOS)
  }, [empleados, busqueda])

  const ejecutar = async (usuarioId, accion) => {
    setOcupado(usuarioId)
    setErrorAccion('')
    try {
      await accion()
      setQuitandoId(null)
      recargar()
    } catch (e) {
      setErrorAccion(e.message)
    } finally {
      setOcupado(null)
    }
  }

  if (cargando) {
    return (
      <section className="mx-auto max-w-5xl px-4 pt-28 pb-20">
        <Volver />
        <p className="mt-12 text-center text-cafe-suave">Cargando el local…</p>
      </section>
    )
  }

  if (error || !bar) {
    return (
      <section className="mx-auto max-w-5xl px-4 pt-28 pb-20">
        <Volver />
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error || 'No hemos encontrado este local entre los tuyos.'}
        </p>
      </section>
    )
  }

  const numPedidos = pedidos.filter((p) => (p.bar?._id ?? p.bar) === bar._id).length
  const pendientes = pendientesPorBar[bar._id] ?? 0

  return (
    <section className="mx-auto max-w-5xl px-4 pt-28 pb-20">
      <Volver />

      <CabeceraOscura etiqueta="Local" titulo={bar.nombre} foto={fotoDelLocal(bar)}>
        <p className="mt-2 text-crema/80">{bar.ubicacion}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm text-crema">
          <span className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
            <strong>{delLocal.length}</strong> {delLocal.length === 1 ? 'empleado' : 'empleados'}
          </span>
          <span className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
            <strong>{pendientes}</strong> {pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <CambiarNombre key={bar.nombre} bar={bar} onGuardado={recargar} />
          <CambiarFoto bar={bar} onGuardado={recargar} />
        </div>
      </CabeceraOscura>

      {errorAccion && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {errorAccion}
        </p>
      )}

      <EncargadosLocal bar={bar} onCambio={recargar} />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <div className={`${tarjeta} p-6 md:p-8`}>
          <h2 className="text-xl font-semibold">Empleados del local</h2>
          {delLocal.length === 0 ? (
            <p className="mt-3 text-cafe-suave">Todavía no hay nadie. Añade empleados con el buscador.</p>
          ) : (
            <ul className="mt-3 divide-y divide-arena">
              {delLocal.map((empleado) => (
                <FilaEmpleado
                  key={empleado._id}
                  empleado={empleado}
                  barActual={bar._id}
                  accion={
                    quitandoId === empleado._id ? (
                      <span className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => ejecutar(empleado._id, () => quitarEmpleado(token, bar._id, empleado._id))}
                          disabled={ocupado === empleado._id}
                          className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {ocupado === empleado._id ? 'Quitando…' : 'Sí, quitar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuitandoId(null)}
                          className="rounded-full px-3 py-2 text-sm font-medium text-cafe-suave hover:bg-arena/40"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setQuitandoId(empleado._id)}
                        className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave ring-1 ring-arena hover:text-red-600 hover:ring-red-200"
                      >
                        Quitar
                      </button>
                    )
                  }
                />
              ))}
            </ul>
          )}
        </div>

        <div className={`${tarjeta} p-6 md:p-8`}>
          <h2 className="text-xl font-semibold">Añadir empleados</h2>
          <p className="mt-1 text-sm text-cafe-suave">
            Busca por nombre, apellidos o correo. Sin buscar, ves los que esperan un local.
          </p>
          <Buscador
            className="mt-4"
            valor={busqueda}
            onCambiar={setBusqueda}
            etiqueta="Buscar empleados"
            placeholder="Nombre, apellidos o correo"
          />
          {resultados.length === 0 ? (
            <p className="mt-4 text-sm text-cafe-suave">
              {busqueda ? 'No hay empleados que coincidan.' : 'No hay empleados esperando un local.'}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-arena">
              {resultados.map((empleado) => (
                <FilaEmpleado
                  key={empleado._id}
                  empleado={empleado}
                  barActual={bar._id}
                  accion={
                    idsDelLocal.has(empleado._id) ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                        Ya está en el local
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => ejecutar(empleado._id, () => añadirEmpleado(token, bar._id, empleado._id))}
                        disabled={ocupado === empleado._id}
                        className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-crema hover:bg-terracota-oscuro disabled:opacity-60"
                      >
                        {ocupado === empleado._id ? 'Añadiendo…' : 'Añadir'}
                      </button>
                    )
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-red-200 bg-red-50/50 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-red-700">Borrar local</h2>
        <p className="mt-1 text-sm text-cafe-suave">
          Se borrarán también sus pedidos y sus empleados dejarán de pertenecer a él. No se puede deshacer.
        </p>
        <button
          type="button"
          onClick={() => setBorrando(true)}
          className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Borrar {bar.nombre}
        </button>
      </div>

      {borrando && (
        <ConfirmarBorrado
          bar={bar}
          numPedidos={numPedidos}
          numEmpleados={delLocal.length}
          onCancelar={() => setBorrando(false)}
          onConfirmar={async () => {
            await borrarBar(token, bar._id)
            navigate('/mis-locales', { replace: true })
          }}
        />
      )}

      <div className="mt-10">
        <Link to="/historial" className={botonSecundario}>
          Ver los pedidos de mis locales
        </Link>
      </div>
    </section>
  )
}
