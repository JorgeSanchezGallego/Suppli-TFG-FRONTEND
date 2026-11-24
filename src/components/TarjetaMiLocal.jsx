import { Link } from 'react-router-dom'
import { buscarLocal, fotoDelLocal } from '../data/locales.js'

function Ubicacion({ texto }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-sm text-cafe-suave">
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      {texto}
    </p>
  )
}

export default function TarjetaMiLocal({ bar, to, children }) {
  const local = buscarLocal(bar.nombre)
  const foto = fotoDelLocal(bar)
  const clases = `group block h-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-15px_rgb(43_33_27/0.25)] ${
    to ? 'transition hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-15px_rgb(43_33_27/0.35)]' : ''
  }`

  const contenido = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        {foto ? (
          <>
            <img
              src={foto}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-cafe/30 to-transparent" />
          </>
        ) : (
          <div className="grid size-full place-items-center bg-linear-to-br from-terracota via-terracota-oscuro to-cafe p-6">
            <span className="text-center text-3xl leading-tight font-semibold break-words text-crema">{bar.nombre}</span>
          </div>
        )}
      </div>

      <div className="space-y-1 p-6">
        <h3 className="text-xl font-semibold">{bar.nombre}</h3>
        {bar.ubicacion && <Ubicacion texto={bar.ubicacion} />}
        {children}
        {to ? (
          <span className="inline-block pt-3 text-sm font-medium text-terracota group-hover:text-terracota-oscuro">
            Gestionar →
          </span>
        ) : (
          local?.mapa && (
            <a
              href={local.mapa}
              target="_blank"
              rel="noreferrer"
              className="inline-block pt-3 text-sm font-medium text-terracota hover:text-terracota-oscuro"
            >
              Cómo llegar →
            </a>
          )
        )}
      </div>
    </>
  )

  return to ? (
    <Link to={to} className={clases}>
      {contenido}
    </Link>
  ) : (
    <article className={clases}>{contenido}</article>
  )
}
