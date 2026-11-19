const iconos = {
  buscar: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  seleccionar: (
    <>
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />
      <path d="m9 11 2 2 4-4" />
    </>
  ),
  historial: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
}

const ventajas = [
  {
    icono: 'buscar',
    titulo: 'Busca lo que necesitas',
    texto: 'Encuentra cada producto con toda su información y a qué proveedor pertenece.',
  },
  {
    icono: 'seleccionar',
    titulo: 'Selecciona y listo',
    texto: 'Ve añadiendo productos a tu pedido de forma sencilla, sin necesidad de formación previa.',
  },
  {
    icono: 'whatsapp',
    titulo: 'Pedido por WhatsApp',
    texto: 'Suppli prepara el mensaje ya formateado y se lo envía al proveedor en un clic.',
  },
  {
    icono: 'historial',
    titulo: 'Todo queda registrado',
    texto: 'Cada pedido se guarda en un historial para consultarlo cuando haga falta.',
  },
]

const etiqueta = 'text-sm font-medium tracking-[0.25em] text-terracota uppercase'

export default function QuienesSomos() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-20 text-center md:pt-24 md:pb-28">
        <p className={etiqueta}>Quiénes somos</p>
        <h1 className="mt-4 text-4xl leading-tight font-semibold md:text-6xl">
          Suppli nace detrás de una barra, no delante de un ordenador.
        </h1>
      </section>

      <section className="bg-arena/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:py-28">
          <div>
            <p className={etiqueta}>El problema</p>
            <div className="mt-6 inline-flex flex-col rounded-3xl bg-crema px-8 py-6">
              <span className="text-6xl font-semibold text-terracota">15</span>
              <span className="text-cafe-suave">años en hostelería</span>
            </div>
          </div>

          <div className="space-y-5 text-lg leading-relaxed text-cafe-suave">
            <p>
              Llevo 15 años trabajando en hostelería, gran parte de ellos como responsable de locales muy
              turísticos y con mucho volumen de trabajo. En todo ese tiempo he aprendido de memoria qué se
              pide a cada proveedor, cuándo y cómo.
            </p>
            <p>
              El problema llega cuando no estoy. En mis días libres o en vacaciones, mis compañeros tienen
              que hacer los pedidos sin saber exactamente qué productos se piden a cada proveedor. Son
              muchos proveedores, y esa información solo la tengo yo en la cabeza.
            </p>
            <p className="font-medium text-cafe">
              El resultado son llamadas, dudas, productos que faltan y pedidos que dependen de una sola
              persona.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className={etiqueta}>La solución</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Una web visual e interactiva donde cualquier compañero puede hacer un pedido sin depender de
            nadie.
          </h2>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ventajas.map((v) => (
            <li key={v.titulo} className="rounded-3xl border border-arena bg-white/60 p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-terracota/10 text-terracota">
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {iconos[v.icono]}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{v.titulo}</h3>
              <p className="mt-2 leading-relaxed text-cafe-suave">{v.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-arena/40">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:py-28">
          <p className={etiqueta}>Quién está detrás</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Jorge Sánchez Gallego</h2>
          <p className="mt-2 text-lg text-terracota">Hostelero de oficio y desarrollador por vocación</p>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-cafe-suave">
            <p>
              Después de 15 años en el sector, estoy terminando el Grado Superior de Desarrollo de
              Aplicaciones Web, y Suppli es mi Trabajo de Fin de Grado.
            </p>
            <p>
              Lo he creado con una idea muy concreta: facilitar el trabajo a mis compañeros y que el local
              funcione igual de bien cuando yo no estoy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
