import { useId, useState } from 'react'
import { ESTADOS, siguienteEstado } from './estados.js'
import { euros, fechaHora } from '../../utils/formato.js'

function EstadoYTotal({ estado, total, unidades }) {
  return (
    <>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.clases}`}>{estado.texto}</span>
      <span className="text-right">
        <span className="block font-semibold">{euros(total)}</span>
        <span className="block text-xs text-cafe-suave">
          {unidades} {unidades === 1 ? 'producto' : 'productos'}
        </span>
      </span>
    </>
  )
}

export default function TarjetaPedido({ pedido, role, onCambiarEstado, onBorrar }) {
  const [abierta, setAbierta] = useState(false)
  const [cambiando, setCambiando] = useState(false)
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')
  const id = useId()

  const estado = ESTADOS[pedido.estado] ?? { texto: pedido.estado, clases: 'bg-arena text-cafe' }
  const siguiente = siguienteEstado(pedido, role)
  const esProveedor = role === 'proveedor'
  const titulo = esProveedor ? pedido.bar?.nombre : pedido.proveedor?.nombre_empresa
  const autor = [pedido.usuario?.nombre, pedido.usuario?.apellidos].filter(Boolean).join(' ')
  const unidades = pedido.productos.length

  const avanzar = async () => {
    setCambiando(true)
    setError('')
    try {
      await onCambiarEstado(pedido, siguiente)
    } catch (e) {
      setError(e.message)
    } finally {
      setCambiando(false)
    }
  }

  const borrar = async () => {
    setBorrando(true)
    setError('')
    try {
      await onBorrar(pedido)
    } catch (e) {
      setError(e.message)
      setBorrando(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)]">
      <button
        type="button"
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        aria-controls={id}
        className="block w-full p-5 text-left transition hover:bg-arena/20 md:px-6"
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-snug font-semibold">{titulo}</p>
            <p className="text-sm text-cafe-suave">
              {!esProveedor && pedido.bar?.nombre && <>{pedido.bar.nombre} · </>}
              {fechaHora(pedido.fecha_pedido ?? pedido.createdAt)}
              {autor && <> · por {autor}</>}
            </p>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <EstadoYTotal estado={estado} total={pedido.total} unidades={unidades} />
          </div>

          <svg
            viewBox="0 0 24 24"
            className={`size-5 shrink-0 text-cafe-suave transition-transform ${abierta ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between sm:hidden">
          <EstadoYTotal estado={estado} total={pedido.total} unidades={unidades} />
        </div>
      </button>

      {abierta && (
        <div id={id} className="border-t border-arena px-5 pt-2 pb-5 md:px-6">
          <ul className="divide-y divide-arena">
            {pedido.productos.map((linea) => (
              <li key={linea._id ?? linea.nombre} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span>
                  <span className="font-medium">{linea.nombre}</span>
                  <span className="text-cafe-suave">
                    {' '}
                    · {linea.cantidad} × {euros(linea.precioUnitario)}
                  </span>
                </span>
                <span className="font-medium">{euros(linea.cantidad * linea.precioUnitario)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center justify-between border-t border-arena pt-3">
            <span className="text-sm text-cafe-suave">Total</span>
            <span className="text-lg font-semibold">{euros(pedido.total)}</span>
          </div>

          {esProveedor && pedido.bar?.ubicacion && (
            <p className="mt-3 text-sm text-cafe-suave">Entregar en: {pedido.bar.ubicacion}</p>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {confirmandoBorrado ? (
            <div role="alert" className="mt-4 rounded-2xl bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">¿Borrar este pedido? No se puede deshacer.</p>
              <p className="mt-1 text-sm text-red-700/80">
                Si ya lo enviaste por WhatsApp, avisa a {pedido.proveedor?.nombre_empresa ?? 'el proveedor'} de que lo anulas.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={borrar}
                  disabled={borrando}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {borrando ? 'Borrando…' : 'Sí, borrar'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoBorrado(false)}
                  disabled={borrando}
                  className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave hover:bg-white/60"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            (onBorrar || siguiente) && (
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                {onBorrar && (
                  <button
                    type="button"
                    onClick={() => setConfirmandoBorrado(true)}
                    className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-400 hover:bg-red-50"
                  >
                    Borrar pedido
                  </button>
                )}
                {siguiente && (
                  <button
                    type="button"
                    onClick={avanzar}
                    disabled={cambiando}
                    className="rounded-full bg-terracota px-5 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-terracota-oscuro disabled:cursor-wait disabled:opacity-70"
                  >
                    {cambiando ? 'Guardando…' : `Marcar como ${ESTADOS[siguiente].texto.toLowerCase()}`}
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </article>
  )
}
