import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useEncargado } from '../hooks/useEncargado.js'
import { añadirEmpleado, añadirEncargado } from '../api/bares.js'
import { obtenerProveedores } from '../api/proveedores.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import FichaEmpleado from '../components/encargado/FichaEmpleado.jsx'
import { tarjeta } from '../components/estilos.js'
import { normalizar } from '../utils/formato.js'
import Volver from '../components/Volver.jsx'

const FILTROS = [
  { clave: 'todos', texto: 'Todos' },
  { clave: 'mios', texto: 'En mis locales' },
  { clave: 'sin-local', texto: 'Sin local' },
  { clave: 'encargados', texto: 'Encargados' },
  { clave: 'proveedores', texto: 'Proveedores' },
]

export default function Empleados() {
  const { token, usuario: yo } = useAuth()
  const { bares, usuarios, empleados, empleadosPorBar, cargando, error, recargar } = useEncargado()
  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    let cancelado = false
    obtenerProveedores(token)
      .then((lista) => {
        if (!cancelado) setProveedores(lista)
      })
      .catch(() => {})
    return () => {
      cancelado = true
    }
  }, [token])
  const [parametros, setParametros] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')

  const filtro = FILTROS.some((f) => f.clave === parametros.get('filtro')) ? parametros.get('filtro') : 'todos'
  const idsMios = useMemo(() => new Set(bares.map((b) => b._id)), [bares])

  const grupos = useMemo(() => {
    const esMio = (e) => (e.bares ?? []).some((b) => idsMios.has(b._id ?? b))
    return {
      todos: usuarios.filter((u) => u.role === 'empleado' || u.role === 'encargado'),
      mios: empleados.filter(esMio),
      'sin-local': empleados.filter((e) => (e.bares ?? []).length === 0),
      encargados: usuarios.filter((u) => u.role === 'encargado'),
      proveedores: usuarios.filter((u) => u.role === 'proveedor'),
    }
  }, [usuarios, empleados, idsMios])

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda)
    const lista = grupos[filtro]
    if (!texto) return lista
    return lista.filter((e) =>
      normalizar(`${e.nombre} ${e.apellidos} ${e.correo} ${e.telefono ?? ''} ${e.residencia ?? ''}`).includes(texto),
    )
  }, [grupos, filtro, busqueda])

  const cambiarFiltro = (clave) => setParametros(clave === 'todos' ? {} : { filtro: clave }, { replace: true })

  const añadir = async (persona, barId) => {
    if (persona.role === 'encargado') await añadirEncargado(token, barId, persona._id)
    else await añadirEmpleado(token, barId, persona._id)
    recargar()
  }

  const chip = (activa) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
      activa ? 'bg-terracota text-crema' : 'bg-white text-cafe-suave ring-1 ring-arena hover:text-cafe'
    }`

  const totalMios = Object.values(empleadosPorBar).reduce((ids, lista) => {
    lista.forEach((e) => ids.add(e._id))
    return ids
  }, new Set()).size

  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 pb-20">
      <Volver />

      <CabeceraOscura etiqueta="Gestión" titulo="Empleados">
        <p className="mt-3 max-w-2xl text-crema/80 md:text-lg">
          Todo el equipo de Suppli, empleados y encargados, con sus datos de contacto y los locales en los que trabajan. Desde aquí también puedes cambiar el rol de cada persona.
        </p>
        {!cargando && !error && (
          <ul className="mt-6 flex flex-wrap gap-2 text-sm text-crema">
            <li className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
              <strong>{grupos.todos.length}</strong> en el equipo
            </li>
            <li className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
              <strong>{totalMios}</strong> en tus locales
            </li>
            <li className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
              <strong>{grupos['sin-local'].length}</strong> sin local
            </li>
          </ul>
        )}
      </CabeceraOscura>

      {cargando && <p className="mt-12 text-center text-cafe-suave">Cargando empleados…</p>}

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar empleados">
              {FILTROS.map(({ clave, texto }) => (
                <button
                  key={clave}
                  type="button"
                  onClick={() => cambiarFiltro(clave)}
                  aria-pressed={filtro === clave}
                  className={chip(filtro === clave)}
                >
                  {texto} ({grupos[clave].length})
                </button>
              ))}
            </div>
            <Buscador
              className="w-full md:max-w-xs"
              valor={busqueda}
              onCambiar={setBusqueda}
              etiqueta="Buscar empleados"
              placeholder="Nombre, correo, teléfono…"
            />
          </div>

          {visibles.length === 0 ? (
            <div className={`${tarjeta} mt-8 p-10 text-center`}>
              <p className="text-xl font-semibold">
                {filtro === 'sin-local' && !busqueda ? 'No hay empleados esperando un local' : 'No hay nadie que coincida'}
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibles.map((empleado) => (
                <li key={empleado._id}>
                  <FichaEmpleado
                    empleado={empleado}
                    misBares={bares}
                    onAñadir={añadir}
                    proveedores={proveedores}
                    esYo={empleado._id === yo._id}
                    onCambiado={recargar}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
