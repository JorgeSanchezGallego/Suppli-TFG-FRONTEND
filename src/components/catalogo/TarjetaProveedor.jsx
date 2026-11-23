import { Link } from 'react-router-dom'
import { capitalizar, listaConY } from '../../utils/formato.js'

export default function TarjetaProveedor({ proveedor, productos, enPedido, repartenHoy }) {
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'))
  const visibles = categorias.slice(0, 3)
  const resto = categorias.length - visibles.length

  return (
    <Link
      to={`/catalogo/${proveedor._id}`}
      className={`group flex h-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-15px_rgb(43_33_27/0.32)] ${
        enPedido ? 'ring-2 ring-terracota' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-terracota/10 text-xl font-semibold text-terracota"
        >
          {proveedor.nombre_empresa.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-snug font-semibold">{proveedor.nombre_empresa}</h3>
          <p className="truncate text-sm text-cafe-suave">Contacto: {proveedor.nombre_persona}</p>
        </div>
        {enPedido && (
          <span className="shrink-0 rounded-full bg-terracota px-2.5 py-1 text-xs font-medium text-crema">En curso</span>
        )}
      </div>

      <div className="flex-1 space-y-2 text-sm">
        <p className="flex items-center gap-2 text-cafe">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
          <span>
            Reparte {proveedor.dias_reparto?.length ? listaConY(proveedor.dias_reparto) : 'sin días fijos'}
            {repartenHoy && <span className="ml-1.5 font-medium text-terracota">· hoy</span>}
          </span>
        </p>
        <p className="text-cafe-suave">
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
        </p>
        {visibles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibles.map((c) => (
              <span key={c} className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">
                {capitalizar(c)}
              </span>
            ))}
            {resto > 0 && (
              <span className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">+{resto}</span>
            )}
          </div>
        )}
      </div>

      <span className="text-sm font-medium text-terracota group-hover:text-terracota-oscuro">Ver productos →</span>
    </Link>
  )
}
