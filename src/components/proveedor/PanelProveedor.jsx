import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import { useProveedor } from '../../hooks/useProveedor.js'
import TarjetaPedido from '../historial/TarjetaPedido.jsx'
import { botonPrimario, botonSecundario, tarjeta } from '../estilos.js'
import { capitalizar, euros, listaConY, repartenHoy } from '../../utils/formato.js'

const MAX_PENDIENTES = 3

function Cifra({ valor, texto, to }) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)] transition hover:-translate-y-0.5 md:p-6"
    >
      <p className="text-3xl font-semibold text-terracota md:text-4xl">{valor}</p>
      <p className="mt-1 text-sm text-cafe-suave">{texto}</p>
    </Link>
  )
}

function AvisoSinEmpresa() {
  return (
    <div role="status" className={`${tarjeta} mt-10 p-6 md:p-8`}>
      <h2 className="text-2xl font-semibold">Tu cuenta no está vinculada a ninguna empresa</h2>
      <p className="mt-2 leading-relaxed text-cafe-suave">
        Para gestionar un catálogo y recibir pedidos, tu usuario tiene que estar asociado a una empresa proveedora.
        Pídeselo a uno de los encargados con los que trabajas.
      </p>
    </div>
  )
}

function Reparto({ dias, pendientes }) {
  if (!dias?.length) {
    return (
      <Link
        to="/mi-empresa"
        className="mt-6 flex items-center gap-4 rounded-3xl bg-terracota/10 p-5 ring-1 ring-terracota/40 transition hover:bg-terracota/15 md:p-6"
      >
        <span className="flex-1">
          <span className="block font-semibold">Aún no has indicado tus días de reparto</span>
          <span className="block text-sm text-cafe-suave">Los bares los ven en tu catálogo para saber cuándo les llega el pedido.</span>
        </span>
        <span aria-hidden="true" className="text-xl text-terracota">
          →
        </span>
      </Link>
    )
  }

  const hoy = repartenHoy(dias)
  return (
    <div
      className={`mt-6 flex items-center gap-4 rounded-3xl p-5 md:p-6 ${
        hoy ? 'bg-terracota text-crema shadow-[0_18px_45px_-15px_rgb(194_100_60/0.7)]' : 'bg-white ring-1 ring-arena'
      }`}
    >
      <svg viewBox="0 0 24 24" className={`size-8 shrink-0 ${hoy ? 'text-crema' : 'text-terracota'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
      <div className="flex-1">
        <p className="font-semibold">
          {hoy
            ? pendientes === 0
              ? 'Hoy es día de reparto y no tienes pedidos pendientes'
              : `Hoy es día de reparto: ${pendientes} ${pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'}`
            : `Repartes los ${listaConY(dias)}`}
        </p>
        {hoy && <p className="text-sm text-crema/80">Tus días de reparto: {listaConY(dias.map(capitalizar))}.</p>}
      </div>
    </div>
  )
}

function Contenido() {
  const { empresa, productos, pendientes, facturadoMes, numLocales, cargando, error } = useProveedor()

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/mi-catalogo" className={botonPrimario}>
          Mi catálogo
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/historial" className={botonSecundario}>
          Pedidos recibidos
        </Link>
        <Link to="/mi-empresa" className={botonSecundario}>
          Datos de la empresa
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {cargando && <p className="mt-10 text-cafe-suave">Cargando tu resumen…</p>}

      {!cargando && !error && empresa && (
        <>
          <p className="mt-8 text-sm font-medium tracking-[0.25em] text-terracota uppercase">{empresa.nombre_empresa}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            <Cifra valor={productos.length} texto={productos.length === 1 ? 'producto' : 'productos'} to="/mi-catalogo" />
            <Cifra
              valor={pendientes.length}
              texto={pendientes.length === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
              to="/historial"
            />
            <Cifra valor={euros(facturadoMes)} texto="en pedidos este mes" to="/historial" />
            <Cifra valor={numLocales} texto={numLocales === 1 ? 'local cliente' : 'locales clientes'} to="/historial" />
          </div>

          <Reparto dias={empresa.dias_reparto} pendientes={pendientes.length} />

          {productos.length === 0 && (
            <div className={`${tarjeta} mt-10 p-8 text-center`}>
              <p className="text-xl font-semibold">Tu catálogo está vacío</p>
              <p className="mt-2 text-cafe-suave">Añade tus productos para que los bares puedan hacerte pedidos.</p>
              <Link to="/mi-catalogo" className={`${botonPrimario} mt-5`}>
                Añadir mi primer producto
              </Link>
            </div>
          )}

          {pendientes.length > 0 && (
            <div className="mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-medium tracking-[0.25em] text-terracota uppercase">Pedidos por entregar</h2>
                {pendientes.length > MAX_PENDIENTES && (
                  <Link to="/historial" className="text-sm font-medium text-terracota hover:text-terracota-oscuro">
                    Ver los {pendientes.length} →
                  </Link>
                )}
              </div>
              <ul className="mt-4 space-y-4">
                {pendientes.slice(0, MAX_PENDIENTES).map((pedido) => (
                  <li key={pedido._id}>
                    <TarjetaPedido pedido={pedido} role="proveedor" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default function PanelProveedor() {
  const { usuario } = useAuth()
  return usuario.proveedor ? <Contenido /> : <AvisoSinEmpresa />
}
