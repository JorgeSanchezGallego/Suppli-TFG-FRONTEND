import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePedido } from '../context/usePedido.js'
import { cantidadConMedida, euros } from '../utils/formato.js'
import SelectorCantidad from './catalogo/SelectorCantidad.jsx'

export default function CarritoMenu({ claro = false }) {
  const pedido = usePedido()
  const { pathname } = useLocation()
  const [abiertoEn, setAbiertoEn] = useState(null)
  const abierto = abiertoEn === pathname
  const contenedor = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!abierto) return
    const alPulsarFuera = (e) => {
      if (!contenedor.current?.contains(e.target)) setAbiertoEn(null)
    }
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') setAbiertoEn(null)
    }
    document.addEventListener('mousedown', alPulsarFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alPulsarFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [abierto])

  const { numProductos, lineas, proveedor, total } = pedido

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => setAbiertoEn(abierto ? null : pathname)}
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={`Pedido en curso: ${numProductos} ${numProductos === 1 ? 'producto' : 'productos'}`}
        className={`relative grid size-10 place-items-center rounded-full transition ${
          claro ? 'text-crema hover:bg-crema/10' : 'text-cafe hover:bg-arena/50'
        } ${abierto ? (claro ? 'bg-crema/10' : 'bg-arena/50') : ''}`}
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6" />
          <circle cx="9" cy="20" r="1.2" />
          <circle cx="17" cy="20" r="1.2" />
        </svg>
        {numProductos > 0 && (
          <span
            key={numProductos}
            className="animate-rebote absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracota px-1 text-[11px] font-semibold text-crema ring-2 ring-crema"
          >
            {numProductos}
          </span>
        )}
      </button>

      {abierto && (
        <div
          id={id}
          role="dialog"
          aria-label="Pedido en curso"
          className="fixed inset-x-4 top-[4.5rem] z-50 rounded-3xl md:absolute md:inset-x-auto md:top-full md:right-0 md:mt-3 md:w-[22rem] bg-white p-5 text-left text-cafe shadow-[0_30px_70px_-20px_rgb(43_33_27/0.5)] ring-1 ring-arena"
        >
          {numProductos === 0 ? (
            <div className="py-4 text-center">
              <p className="font-semibold">Tu pedido está vacío</p>
              <p className="mt-1 text-sm text-cafe-suave">Añade productos desde el catálogo.</p>
              <Link
                to="/catalogo"
                className="mt-4 inline-block rounded-full bg-terracota px-5 py-2 text-sm font-medium text-crema transition-colors hover:bg-terracota-oscuro"
              >
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-terracota uppercase">Pedido a</p>
                  <Link to={`/catalogo/${proveedor?._id}`} className="font-semibold hover:text-terracota">
                    {proveedor?.nombre_empresa}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={pedido.vaciar}
                  className="shrink-0 text-sm font-medium text-cafe-suave underline-offset-4 hover:text-red-600 hover:underline"
                >
                  Vaciar
                </button>
              </div>

              <ul className="mt-4 max-h-64 divide-y divide-arena overflow-y-auto">
                {lineas.map(({ producto, cantidad }) => (
                  <li key={producto._id} className="flex items-center gap-3 py-3">
                    <img src={producto.imagen} alt="" className="size-10 shrink-0 self-start rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{producto.nombre}</p>
                      <p className="text-xs text-cafe-suave">
                        {cantidadConMedida(cantidad, producto.medida)} · {euros(producto.precio * cantidad)}
                      </p>
                      <div className="mt-2">
                        <SelectorCantidad
                          compacto
                          producto={producto}
                          cantidad={cantidad}
                          onCambiar={(nueva) => pedido.cambiarCantidad(producto, nueva)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => pedido.cambiarCantidad(producto, 0)}
                      aria-label={`Quitar ${producto.nombre} del pedido`}
                      className="grid size-7 shrink-0 self-start place-items-center rounded-full text-cafe-suave hover:bg-red-50 hover:text-red-600"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-arena pt-3">
                <span className="text-sm text-cafe-suave">Total</span>
                <span className="text-lg font-semibold">{euros(total)}</span>
              </div>

              <Link
                to="/pedido"
                className="mt-4 block w-full rounded-full bg-terracota py-2.5 text-center font-medium text-crema transition-colors hover:bg-terracota-oscuro"
              >
                Revisar pedido
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
