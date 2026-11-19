import { useRef, useState } from 'react'

export default function Carrusel({ fotos, alt, children }) {
  const pista = useRef(null)
  const [actual, setActual] = useState(0)

  const irA = (indice) => {
    const el = pista.current
    el.scrollTo({ left: indice * el.clientWidth, behavior: 'smooth' })
  }

  const alDesplazar = () => {
    const el = pista.current
    setActual(Math.round(el.scrollLeft / el.clientWidth))
  }

  const flecha =
    'absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-crema/85 text-cafe shadow transition hover:bg-crema disabled:pointer-events-none disabled:opacity-0'

  return (
    <div className="relative overflow-hidden rounded-3xl" aria-roledescription="carrusel" aria-label={alt}>
      <div
        ref={pista}
        onScroll={alDesplazar}
        className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:aspect-square [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, i) => (
          <img
            key={foto}
            src={foto}
            alt={`${alt}, foto ${i + 1} de ${fotos.length}`}
            loading="lazy"
            className="size-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-cafe/50 via-transparent to-cafe/40" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-6">{children}</div>

      <button type="button" onClick={() => irA(actual - 1)} disabled={actual === 0} aria-label="Foto anterior" className={`${flecha} left-3`}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => irA(actual + 1)}
        disabled={actual === fotos.length - 1}
        aria-label="Foto siguiente"
        className={`${flecha} right-3`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {fotos.map((foto, i) => (
          <button
            key={foto}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === actual}
            className={`h-2 rounded-full transition-all ${i === actual ? 'w-6 bg-crema' : 'w-2 bg-crema/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
