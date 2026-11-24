import { Link } from 'react-router-dom'
import { useEncargado } from '../../hooks/useEncargado.js'
import TarjetaMiLocal from '../TarjetaMiLocal.jsx'
import OtrosEncargados from './OtrosEncargados.jsx'
import { botonPrimario, botonSecundario } from '../estilos.js'

function Cifra({ valor, texto, to }) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)] transition hover:-translate-y-0.5 md:p-6"
    >
      <p className="text-4xl font-semibold text-terracota">{valor}</p>
      <p className="mt-1 text-sm text-cafe-suave">{texto}</p>
    </Link>
  )
}

export default function PanelEncargado() {
  const { bares, misEmpleados, sinLocal, pendientes, empleadosPorBar, pendientesPorBar, cargando, error } =
    useEncargado()

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/mis-locales" className={botonPrimario}>
          Gestionar locales
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/empleados" className={botonSecundario}>
          Empleados
        </Link>
        <Link to="/historial" className={botonSecundario}>
          Ver pedidos
        </Link>
        <Link to="/catalogo" className={botonSecundario}>
          Catálogo
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {cargando && <p className="mt-10 text-cafe-suave">Cargando tu resumen…</p>}

      {!cargando && !error && (
        <>
          <div className="mt-10 grid grid-cols-3 gap-3 md:gap-6">
            <Cifra valor={bares.length} texto={bares.length === 1 ? 'local' : 'locales'} to="/mis-locales" />
            <Cifra valor={misEmpleados.length} texto={misEmpleados.length === 1 ? 'empleado' : 'empleados'} to="/empleados?filtro=mios" />
            <Cifra valor={pendientes} texto={pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'} to="/historial" />
          </div>

          {sinLocal.length > 0 && bares.length > 0 && (
            <Link
              to="/empleados?filtro=sin-local"
              className="mt-6 flex items-center gap-4 rounded-3xl bg-terracota/10 p-5 ring-1 ring-terracota/40 transition hover:bg-terracota/15 md:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-terracota text-xl font-semibold text-crema">
                {sinLocal.length}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">
                  {sinLocal.length === 1 ? 'Hay 1 empleado esperando un local' : `Hay ${sinLocal.length} empleados esperando un local`}
                </span>
                <span className="block text-sm text-cafe-suave">
                  Se han registrado pero no pueden hacer pedidos hasta que los añadas a uno de tus locales.
                </span>
              </span>
              <span aria-hidden="true" className="text-xl text-terracota">
                →
              </span>
            </Link>
          )}

          <div className="mt-10">
            <h2 className="text-sm font-medium tracking-[0.25em] text-terracota uppercase">
              {bares.length === 1 ? 'Tu local' : 'Tus locales'}
            </h2>
            {bares.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-white p-8 text-center shadow-[0_24px_60px_-15px_rgb(43_33_27/0.2)]">
                <p className="text-xl font-semibold">Todavía no tienes locales</p>
                <Link to="/mis-locales" className={`${botonPrimario} mt-5`}>
                  Crear mi primer local
                </Link>
              </div>
            ) : (
              <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bares.map((bar) => {
                  const empleados = empleadosPorBar[bar._id]?.length ?? 0
                  const pendientesBar = pendientesPorBar[bar._id] ?? 0
                  return (
                    <li key={bar._id}>
                      <TarjetaMiLocal bar={bar} to={`/mis-locales/${bar._id}`}>
                        <p className="pt-2 text-sm text-cafe">
                          {empleados} {empleados === 1 ? 'empleado' : 'empleados'} · {pendientesBar}{' '}
                          {pendientesBar === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
                        </p>
                        <OtrosEncargados bar={bar} />
                      </TarjetaMiLocal>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
