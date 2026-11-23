export default function Buscador({ valor, onCambiar, placeholder, etiqueta, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{etiqueta}</span>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-cafe-suave" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-arena bg-white py-2.5 pr-4 pl-10 text-sm text-cafe shadow-sm outline-none placeholder:text-cafe-suave/60 focus:border-terracota focus:ring-4 focus:ring-terracota/15"
      />
    </label>
  )
}
