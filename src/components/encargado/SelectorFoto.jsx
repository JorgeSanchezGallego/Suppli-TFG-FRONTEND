import { useEffect, useId, useMemo } from 'react'
import { FORMATOS_FOTO } from '../../utils/validaciones.js'

export default function SelectorFoto({
  archivo,
  onCambiar,
  error,
  actual = '',
  opcional = true,
  ayuda = 'Si no subes foto, la tarjeta mostrará el nombre del local.',
}) {
  const id = useId()
  const vista = useMemo(() => (archivo ? URL.createObjectURL(archivo) : ''), [archivo])

  useEffect(() => {
    if (!vista) return
    return () => URL.revokeObjectURL(vista)
  }, [vista])

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">
        Foto {opcional && <span className="font-normal text-cafe-suave">(opcional)</span>}
      </span>
      <div className="flex items-center gap-4">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-arena/60 text-cafe-suave">
          {archivo && vista ? (
            <img src={vista} alt="Vista previa de la foto" className="size-full object-cover" />
          ) : actual ? (
            <img src={actual} alt="Foto actual" className="size-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="m21 16-5-5-9 8" />
            </svg>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={id}
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-cafe ring-1 ring-arena transition hover:bg-arena/40"
          >
            {archivo || actual ? 'Cambiar' : 'Elegir foto'}
          </label>
          {archivo && (
            <button
              type="button"
              onClick={() => onCambiar(null)}
              className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave hover:text-red-600"
            >
              Quitar
            </button>
          )}
          <input
            id={id}
            type="file"
            accept={FORMATOS_FOTO}
            className="sr-only"
            onChange={(e) => {
              onCambiar(e.target.files?.[0] ?? null)
              e.target.value = ''
            }}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : (
        ayuda && <p className="mt-1.5 text-xs text-cafe-suave">{ayuda}</p>
      )}
    </div>
  )
}
