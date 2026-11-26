import { Link } from 'react-router-dom'
import { botonPrimario } from './estilos.js'
import { guardarConsentimiento, useConsentimiento } from '../utils/consentimiento.js'

const botonOscuro =
  'inline-flex flex-1 items-center justify-center rounded-full bg-crema/10 px-6 py-3 font-medium text-crema ring-1 ring-crema/40 transition hover:bg-crema/20 hover:ring-crema'

export default function AvisoCookies() {
  const eleccion = useConsentimiento()

  if (eleccion) return null

  return (
    <div
      role="dialog"
      aria-labelledby="aviso-cookies-titulo"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-3xl bg-cafe p-5 text-crema/85 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.6)] md:bottom-6 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="space-y-1 text-sm leading-relaxed">
          <p id="aviso-cookies-titulo" className="text-base font-semibold text-crema">
            Tu privacidad
          </p>
          <p>
            Suppli no usa cookies de análisis ni de publicidad. Solo guarda los datos técnicos necesarios para
            mantener tu sesión y tu pedido.{' '}
            <Link to="/politica-cookies" className="font-medium text-crema underline underline-offset-2">
              Más información
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => guardarConsentimiento('rechazado')}
            className={botonOscuro}
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => guardarConsentimiento('aceptado')}
            className={`${botonPrimario} flex-1`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
