import { botonSecundario, tarjeta } from '../components/estilos.js'
import { guardarConsentimiento, useConsentimiento } from '../utils/consentimiento.js'

const CORREO = 'jorgesanchezluky@gmail.com'

const terceros = [
  {
    nombre: 'Cloudinary',
    texto: 'Aloja las fotos de los locales. Al mostrarlas, tu navegador las descarga de sus servidores.',
  },
  {
    nombre: 'WhatsApp',
    texto: 'Al enviar un pedido se abre WhatsApp con el mensaje preparado. A partir de ahí se aplica la política de WhatsApp.',
  },
  {
    nombre: 'Enlaces externos',
    texto: 'Las webs de los locales, Google Maps o LinkedIn tienen sus propias políticas de cookies, que se aplican al entrar en ellas.',
  },
]

const textoEleccion = {
  aceptado: 'Aceptaste el aviso de cookies.',
  rechazado: 'Rechazaste el aviso de cookies.',
}

const etiqueta = 'text-sm font-medium tracking-[0.25em] text-terracota uppercase'
const titulo = 'text-2xl font-semibold md:text-3xl'
const parrafo = 'leading-relaxed text-cafe-suave'

export default function PoliticaCookies() {
  const eleccion = useConsentimiento()

  return (
    <div className="pt-16 md:pt-20">
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-10 text-center md:pt-24">
        <p className={etiqueta}>Información legal</p>
        <h1 className="mt-4 text-4xl leading-tight font-semibold md:text-5xl">Política de cookies</h1>
        <p className="mt-4 text-cafe-suave">Última actualización: 26 de noviembre de 2026</p>
      </section>

      <div className="mx-auto max-w-3xl space-y-14 px-4 pb-20 md:pb-28">
        <section className="space-y-4">
          <h2 className={titulo}>Qué son las cookies</h2>
          <p className={parrafo}>
            Las cookies y tecnologías parecidas, como el almacenamiento local del navegador (localStorage),
            son pequeños archivos que una web guarda en tu dispositivo para recordar información entre una
            visita y otra.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={titulo}>Qué usa Suppli</h2>
          <p className={parrafo}>
            Suppli <strong className="font-semibold text-cafe">no usa cookies</strong> ni herramientas de
            análisis, publicidad o seguimiento. Solo guarda en el almacenamiento local de tu navegador los
            datos técnicos imprescindibles para que la aplicación funcione: tu sesión iniciada, el pedido que
            estás preparando y tu respuesta a este aviso.
          </p>

          <p className={parrafo}>
            Según el artículo 22.2 de la Ley 34/2002 (LSSI) y la guía de la Agencia Española de Protección de
            Datos, este almacenamiento técnico está exento de consentimiento porque sin él no se podría
            prestar el servicio que pides.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={titulo}>Servicios de terceros</h2>
          <ul className="space-y-3">
            {terceros.map((tercero) => (
              <li key={tercero.nombre} className={parrafo}>
                <strong className="font-semibold text-cafe">{tercero.nombre}.</strong> {tercero.texto}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className={titulo}>Cómo gestionarlas</h2>
          <p className={parrafo}>
            Puedes borrar estos datos en cualquier momento desde la configuración de tu navegador, en el
            apartado de privacidad o de datos de sitios. Si lo haces, se cerrará tu sesión y se perderá el
            pedido que no hayas enviado.
          </p>
        </section>

        <section className={`${tarjeta} space-y-4 p-6 md:p-8`}>
          <h2 className={titulo}>Tu elección</h2>
          <p className={parrafo}>{textoEleccion[eleccion] ?? 'Todavía no has respondido al aviso de cookies.'}</p>
          {eleccion && (
            <button type="button" onClick={() => guardarConsentimiento(null)} className={botonSecundario}>
              Cambiar mi elección
            </button>
          )}
        </section>

        <section className="space-y-4">
          <h2 className={titulo}>Contacto</h2>
          <p className={parrafo}>
            El responsable de Suppli es Jorge Sánchez Gallego. Para cualquier duda sobre esta política puedes
            escribir a{' '}
            <a href={`mailto:${CORREO}`} className="font-medium text-terracota hover:text-terracota-oscuro">
              {CORREO}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
