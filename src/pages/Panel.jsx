import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import TarjetaMiLocal from '../components/TarjetaMiLocal.jsx'

const roles = {
  empleado: 'Empleado',
  encargado: 'Encargado',
  proveedor: 'Proveedor',
}

function AvisoSinLocal() {
  return (
    <div
      role="status"
      className="mt-10 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.25)] sm:flex-row sm:items-start md:p-8"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-terracota/10 text-terracota">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18" />
          <path d="M5 21V8l7-5 7 5v13" />
          <path d="M9 21v-6h6v6" />
        </svg>
      </span>
      <div>
        <h2 className="text-2xl font-semibold">Aún no tienes un local asignado</h2>
        <p className="mt-2 leading-relaxed text-cafe-suave">
          Tu cuenta ya está creada, pero para hacer pedidos el encargado de tu local tiene que añadirte a su equipo.
          Pídeselo y, en cuanto lo haga, verás aquí tu local sin tener que volver a iniciar sesión.
        </p>
      </div>
    </div>
  )
}

function MisLocales({ bares }) {
  return (
    <div className="mt-10">
      <h2 className="text-sm font-medium tracking-[0.25em] text-terracota uppercase">
        {bares.length === 1 ? 'Tu local' : 'Tus locales'}
      </h2>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bares.map((bar) => (
          <li key={bar._id}>
            <TarjetaMiLocal bar={bar} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Panel() {
  const { usuario } = useAuth()
  const bares = (usuario.bares ?? []).filter((bar) => typeof bar === 'object')
  const esEmpleado = usuario.role === 'empleado'
  const sinLocal = esEmpleado && (usuario.bares ?? []).length === 0

  return (
    <section className="mx-auto max-w-5xl px-4 pt-32 pb-20">
      <span className="inline-block rounded-full bg-terracota/10 px-3 py-1 text-sm font-medium text-terracota">
        {roles[usuario.role] ?? usuario.role}
      </span>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Hola, {usuario.nombre}</h1>

      {sinLocal ? (
        <AvisoSinLocal />
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-terracota px-6 py-3 font-medium text-crema shadow-[0_12px_30px_-10px_rgb(194_100_60/0.7)] transition hover:bg-terracota-oscuro"
            >
              Ir al catálogo
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/historial"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-cafe ring-1 ring-arena transition hover:bg-arena/40"
            >
              Ver pedidos
            </Link>
          </div>
          {esEmpleado && bares.length > 0 && <MisLocales bares={bares} />}
        </>
      )}
    </section>
  )
}
