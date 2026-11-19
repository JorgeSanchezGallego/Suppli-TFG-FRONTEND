const tamanos = {
  sm: { icono: 'size-8 text-lg rounded-lg', texto: 'text-2xl' },
  lg: { icono: 'size-16 text-4xl rounded-2xl md:size-20 md:text-5xl', texto: 'text-6xl md:text-7xl' },
}

export default function Logo({ tamano = 'sm', claro = false }) {
  const t = tamanos[tamano]

  return (
    <span className="inline-flex items-center gap-2 md:gap-3">
      <span
        aria-hidden="true"
        className={`${t.icono} grid place-items-center bg-terracota font-semibold text-crema`}
      >
        S
      </span>
      <span
        className={`${t.texto} font-semibold tracking-tight transition-colors duration-300 ${
          claro ? 'text-crema' : 'text-cafe'
        }`}
      >
        suppli
      </span>
    </span>
  )
}
