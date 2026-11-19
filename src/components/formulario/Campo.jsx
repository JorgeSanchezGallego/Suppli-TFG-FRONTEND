export const estiloCampo =
  'w-full rounded-xl border bg-white px-4 py-3 text-cafe outline-none transition placeholder:text-cafe-suave/60 focus:border-terracota focus:ring-4 focus:ring-terracota/15'

export function Etiqueta({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {children}
    </label>
  )
}

export function MensajeError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {children}
    </p>
  )
}

export default function Campo({ id, etiqueta, error, className = '', ...props }) {
  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        className={`${estiloCampo} ${error ? 'border-red-400' : 'border-arena'}`}
        {...props}
      />
      <MensajeError id={`error-${id}`}>{error}</MensajeError>
    </div>
  )
}
