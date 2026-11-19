import { useState } from 'react'
import { Etiqueta, MensajeError, estiloCampo } from './Campo.jsx'

export default function CampoContrasena({ id, etiqueta, error, className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `error-${id}` : undefined}
          className={`${estiloCampo} pr-12 ${error ? 'border-red-400' : 'border-arena'}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-cafe-suave hover:text-cafe"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </div>
      <MensajeError id={`error-${id}`}>{error}</MensajeError>
    </div>
  )
}
