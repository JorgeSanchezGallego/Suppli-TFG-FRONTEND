import { useEffect, useRef } from 'react'

export default function AvisoCambioProveedor({ actual, nuevo, onSeguir, onCambiar }) {
  const botonSeguir = useRef(null)

  useEffect(() => {
    botonSeguir.current?.focus()
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') onSeguir()
    }
    document.addEventListener('keydown', alPulsarTecla)
    return () => document.removeEventListener('keydown', alPulsarTecla)
  }, [onSeguir])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cafe/50 p-4 backdrop-blur-sm" onClick={onSeguir}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aviso-titulo"
        aria-describedby="aviso-texto"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-crema p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.6)] sm:p-8"
      >
        <h2 id="aviso-titulo" className="text-2xl font-semibold">
          Ya tienes un pedido en curso
        </h2>
        <p id="aviso-texto" className="mt-3 leading-relaxed text-cafe-suave">
          Tu pedido actual es para <strong className="text-cafe">{actual}</strong>. Cada pedido va a un solo
          proveedor: envíalo antes de pedir a <strong className="text-cafe">{nuevo}</strong>, o vacíalo para empezar
          uno nuevo.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            ref={botonSeguir}
            type="button"
            onClick={onSeguir}
            className="flex-1 rounded-full bg-terracota px-5 py-3 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
          >
            Seguir con {actual}
          </button>
          <button
            type="button"
            onClick={onCambiar}
            className="flex-1 rounded-full border border-cafe/20 px-5 py-3 font-medium text-cafe transition-colors hover:border-cafe/40 hover:bg-arena/40"
          >
            Vaciar y pedir a {nuevo}
          </button>
        </div>
      </div>
    </div>
  )
}
