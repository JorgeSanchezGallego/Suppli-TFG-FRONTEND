import { useEffect, useId, useRef, useState } from 'react'
import { capitalizar, temporadaActual } from '../../utils/formato.js'

export default function InfoProducto({ producto, diasReparto = [] }) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const id = useId()
  const temporada = temporadaActual()

  useEffect(() => {
    if (!abierto) return
    const alPulsarFuera = (e) => {
      if (!contenedor.current?.contains(e.target)) setAbierto(false)
    }
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alPulsarFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alPulsarFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [abierto])

  const filas = [
    { temporada: 'invierno', valor: producto.stock_optimo_invierno },
    { temporada: 'verano', valor: producto.stock_optimo_verano },
  ]

  return (
    <div
      ref={contenedor}
      className="relative shrink-0"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
      onFocus={() => setAbierto(true)}
      onBlur={(e) => {
        if (!contenedor.current?.contains(e.relatedTarget)) setAbierto(false)
      }}
    >
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-describedby={abierto ? id : undefined}
        aria-label={`Más información de ${producto.nombre}`}
        className={`grid size-8 place-items-center rounded-full transition ${
          abierto ? 'bg-terracota text-crema' : 'bg-terracota/10 text-terracota hover:bg-terracota hover:text-crema'
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 7.5h.01" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute top-full right-0 z-20 pt-2">
          <div
            id={id}
            role="tooltip"
            className="w-64 rounded-2xl bg-white p-4 text-left shadow-[0_24px_60px_-15px_rgb(43_33_27/0.45)] ring-1 ring-arena"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-terracota uppercase">Stock óptimo</p>
            <ul className="mt-2 space-y-1.5">
              {filas.map((fila) => (
                <li
                  key={fila.temporada}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm ${
                    fila.temporada === temporada ? 'bg-terracota/10 font-medium text-cafe' : 'text-cafe-suave'
                  }`}
                >
                  <span>{capitalizar(fila.temporada)}</span>
                  <span>
                    {fila.valor} {producto.medida}
                  </span>
                </li>
              ))}
            </ul>

            {diasReparto.length > 0 && (
              <>
                <p className="mt-4 text-xs font-medium tracking-[0.2em] text-terracota uppercase">Días de reparto</p>
                <p className="mt-1.5 text-sm text-cafe">{diasReparto.map(capitalizar).join(' y ')}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
