import { buscarLocal } from '../data/locales.js'

export default function TarjetaMiLocal({ bar }) {
  const local = buscarLocal(bar.nombre)

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-15px_rgb(43_33_27/0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {local ? (
          <img
            src={local.fotos[0]}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-terracota to-terracota-oscuro" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-cafe/70 via-cafe/10 to-cafe/30" />

        <div className="absolute inset-0 grid place-items-center p-6">
          {local ? (
            <img src={local.logo} alt="" className="h-14 w-auto max-w-[70%] object-contain brightness-0 invert" />
          ) : (
            <span className="text-5xl font-semibold text-crema">{bar.nombre.charAt(0)}</span>
          )}
        </div>
      </div>

      <div className="space-y-1 p-6">
        <h3 className="text-xl font-semibold">{bar.nombre}</h3>
        {bar.ubicacion && (
          <p className="inline-flex items-center gap-1.5 text-sm text-cafe-suave">
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {bar.ubicacion}
          </p>
        )}
        {local?.mapa && (
          <a
            href={local.mapa}
            target="_blank"
            rel="noreferrer"
            className="inline-block pt-3 text-sm font-medium text-terracota hover:text-terracota-oscuro"
          >
            Cómo llegar →
          </a>
        )}
      </div>
    </article>
  )
}
