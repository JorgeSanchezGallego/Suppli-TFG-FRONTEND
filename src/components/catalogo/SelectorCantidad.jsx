import { pasoCantidad } from '../../utils/formato.js'

export default function SelectorCantidad({ producto, cantidad, onCambiar }) {
  const paso = pasoCantidad(producto.medida)
  const redondear = (valor) => Math.max(0, Math.round(valor / paso) * paso)

  const escribir = (e) => {
    const valor = Number(e.target.value.replace(',', '.'))
    if (!Number.isNaN(valor)) onCambiar(redondear(valor))
  }

  const boton =
    'grid size-9 place-items-center rounded-full text-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCambiar(redondear(cantidad - paso))}
          disabled={cantidad <= 0}
          aria-label={`Quitar ${producto.nombre}`}
          className={`${boton} border border-cafe/15 text-cafe hover:border-cafe/40`}
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={paso}
          value={cantidad}
          onChange={escribir}
          onFocus={(e) => e.target.select()}
          aria-label={`Cantidad de ${producto.nombre} (${producto.medida})`}
          className="h-9 w-14 rounded-xl border border-arena bg-white text-center font-medium text-cafe outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/15 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onCambiar(redondear(cantidad + paso))}
          aria-label={`Añadir ${producto.nombre}`}
          className={`${boton} bg-terracota text-crema hover:bg-terracota-oscuro`}
        >
          +
        </button>
      </div>
      <p className="mt-1 text-xs text-cafe-suave">Cantidad en {producto.medida}</p>
    </div>
  )
}
