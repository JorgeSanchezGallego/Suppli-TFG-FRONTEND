export default function SelectorCantidad({ producto, cantidad, onCambiar, compacto = false }) {
  const paso = 1
  const redondear = (valor) => Math.max(0, Math.round(valor))

  const escribir = (e) => {
    const valor = Number(e.target.value)
    if (!Number.isNaN(valor)) onCambiar(redondear(valor))
  }

  const boton = `grid place-items-center rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
    compacto ? 'size-7 text-base' : 'size-9 text-lg'
  }`

  return (
    <div>
      <div className={`flex items-center ${compacto ? 'gap-1.5' : 'gap-2'}`}>
        <button
          type="button"
          onClick={() => onCambiar(redondear(cantidad - paso))}
          disabled={cantidad <= 0}
          aria-label={compacto ? `Restar ${producto.nombre}` : `Quitar ${producto.nombre}`}
          className={`${boton} border border-cafe/15 text-cafe hover:border-cafe/40`}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step={paso}
          value={cantidad}
          onChange={escribir}
          onFocus={(e) => e.target.select()}
          aria-label={`Cantidad de ${producto.nombre} (${producto.medida})`}
          className={`rounded-xl border border-arena bg-white text-center font-medium text-cafe outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/15 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            compacto ? 'h-7 w-11 text-sm' : 'h-9 w-14'
          }`}
        />
        <button
          type="button"
          onClick={() => onCambiar(redondear(cantidad + paso))}
          aria-label={compacto ? `Sumar ${producto.nombre}` : `Añadir ${producto.nombre}`}
          className={`${boton} bg-terracota text-crema hover:bg-terracota-oscuro`}
        >
          +
        </button>
      </div>
      {!compacto && <p className="mt-1 text-xs text-cafe-suave">Cantidad en {producto.medida}</p>}
    </div>
  )
}
