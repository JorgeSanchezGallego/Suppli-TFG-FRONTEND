import InfoProducto from './InfoProducto.jsx'
import SelectorCantidad from './SelectorCantidad.jsx'
import { capitalizar, euros } from '../../utils/formato.js'

export default function TarjetaProducto({ producto, diasReparto, puedePedir, cantidad, onCambiarCantidad }) {
  const enPedido = cantidad > 0

  return (
    <article
      className={`flex h-full gap-4 rounded-3xl bg-white p-4 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)] transition ${
        enPedido ? 'ring-2 ring-terracota' : ''
      }`}
    >
      <img
        src={producto.imagen}
        alt=""
        loading="lazy"
        className="size-20 shrink-0 self-center rounded-2xl bg-arena/40 object-cover sm:size-24"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium tracking-[0.15em] text-terracota uppercase">
              {producto.proveedor?.nombre_empresa}
            </p>
            <h3 className="mt-0.5 leading-snug font-semibold">{producto.nombre}</h3>
          </div>
          <InfoProducto producto={producto} diasReparto={diasReparto} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-cafe-suave">
            <span className="text-lg font-semibold text-cafe">{euros(producto.precio)}</span> / {producto.medida}
          </p>
          <span className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">
            {capitalizar(producto.categoria)}
          </span>
        </div>

        {puedePedir && (
          <SelectorCantidad
            producto={producto}
            cantidad={cantidad}
            onCambiar={(nueva) => onCambiarCantidad(producto, nueva)}
          />
        )}
      </div>
    </article>
  )
}
