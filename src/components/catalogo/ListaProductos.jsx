import TarjetaProducto from './TarjetaProducto.jsx'
import { usePedido } from '../../context/usePedido.js'

export default function ListaProductos({ productos, diasPorProveedor, puedePedir, onCambiarCantidad }) {
  const pedido = usePedido()

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <li key={producto._id}>
          <TarjetaProducto
            producto={producto}
            diasReparto={diasPorProveedor[producto.proveedor?._id] ?? []}
            puedePedir={puedePedir}
            cantidad={pedido.cantidadDe(producto._id)}
            onCambiarCantidad={onCambiarCantidad}
          />
        </li>
      ))}
    </ul>
  )
}
