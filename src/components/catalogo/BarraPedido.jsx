import { Link } from 'react-router-dom'
import { usePedido } from '../../context/usePedido.js'
import { euros } from '../../utils/formato.js'

export default function BarraPedido() {
  const { proveedor, numProductos, total, vaciar } = usePedido()

  if (numProductos === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl bg-white p-4 text-cafe shadow-[0_24px_60px_-10px_rgb(43_33_27/0.55)] ring-2 ring-terracota sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-terracota uppercase">
            Pedido a{' '}
            <Link to={`/catalogo/${proveedor?._id}`} className="underline decoration-terracota/40 underline-offset-4 hover:text-terracota-oscuro">
              {proveedor?.nombre_empresa}
            </Link>
          </p>
          <p className="mt-0.5 text-lg font-semibold">
            {numProductos} {numProductos === 1 ? 'producto' : 'productos'} · {euros(total)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={vaciar}
            className="flex-1 rounded-full border border-cafe/20 px-5 py-2.5 font-medium text-cafe transition hover:bg-arena/40 sm:flex-none"
          >
            Vaciar
          </button>
          <Link
            to="/pedido"
            className="flex-1 rounded-full bg-terracota px-5 py-2.5 text-center font-medium text-crema transition-colors hover:bg-terracota-oscuro sm:flex-none"
          >
            Revisar pedido
          </Link>
        </div>
      </div>
    </div>
  )
}
