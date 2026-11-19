import Carrusel from './Carrusel.jsx'

export default function TarjetaLocal({ local, invertida = false }) {
  return (
    <article className="grid items-center gap-8 rounded-[2rem] bg-white p-4 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.32)] sm:p-6 md:grid-cols-2 md:gap-12 md:p-8 lg:gap-16 lg:p-10">
      <div className={invertida ? 'md:order-2' : ''}>
        <Carrusel fotos={local.fotos} alt={local.nombre}>
          <img src={local.logo} alt="" className="h-12 w-auto max-w-[60%] object-contain brightness-0 invert md:h-14" />
        </Carrusel>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-3xl font-semibold md:text-4xl">{local.nombre}</h3>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-cafe-suave">
            <svg viewBox="0 0 24 24" className="size-4 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {local.direccion}
          </p>
        </div>

        <div className="space-y-3 leading-relaxed text-cafe-suave">
          {local.texto.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={local.web}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-terracota px-5 py-2.5 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
          >
            Visitar web
          </a>
          <a
            href={local.mapa}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-cafe/20 px-5 py-2.5 font-medium text-cafe transition-colors hover:border-cafe/40 hover:bg-arena/40"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </article>
  )
}
