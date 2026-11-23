import { useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { usePedido } from '../context/usePedido.js'
import { useCatalogo } from '../hooks/useCatalogo.js'
import { useCambiarCantidad } from '../hooks/useCambiarCantidad.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import TarjetaProveedor from '../components/catalogo/TarjetaProveedor.jsx'
import ListaProductos from '../components/catalogo/ListaProductos.jsx'
import BarraPedido from '../components/catalogo/BarraPedido.jsx'
import { normalizar, repartenHoy } from '../utils/formato.js'
import fotoCabecera from '../assets/img/hero.jpg'

export default function Catalogo() {
  const { usuario } = useAuth()
  const pedido = usePedido()
  const { productos, proveedores, productosPorProveedor, cargando, error } = useCatalogo()
  const { cambiarCantidad, aviso } = useCambiarCantidad()

  const [busqueda, setBusqueda] = useState('')

  const esEmpleado = usuario.role === 'empleado'
  const puedePedir = esEmpleado && (usuario.bares ?? []).length > 0
  const texto = normalizar(busqueda)

  const diasPorProveedor = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p._id, p.dias_reparto ?? []])),
    [proveedores],
  )

  const productosEncontrados = useMemo(() => {
    if (!texto) return []
    return productos.filter(
      (p) => normalizar(p.nombre).includes(texto) || normalizar(p.categoria).includes(texto),
    )
  }, [productos, texto])

  const proveedoresVisibles = useMemo(() => {
    const conProducto = new Set(productosEncontrados.map((p) => p.proveedor?._id))
    return proveedores
      .filter((p) => !texto || normalizar(p.nombre_empresa).includes(texto) || conProducto.has(p._id))
      .sort((a, b) => a.nombre_empresa.localeCompare(b.nombre_empresa, 'es'))
  }, [proveedores, productosEncontrados, texto])

  const productosVisibles = productosEncontrados
  const numCategorias = new Set(productos.map((p) => p.categoria)).size

  return (
    <section className={`mx-auto max-w-6xl px-4 pt-28 ${pedido.numProductos > 0 ? 'pb-48' : 'pb-20'}`}>
      <header className="relative overflow-hidden rounded-[2rem] bg-cafe px-6 py-10 shadow-[0_30px_70px_-20px_rgb(43_33_27/0.55)] sm:px-10 md:px-14 md:py-14">
        <img src={fotoCabecera} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-linear-to-r from-cafe via-cafe/85 to-terracota/50" />

        <div className="relative max-w-2xl">
          <p className="text-sm font-medium tracking-[0.25em] text-crema/70 uppercase">Catálogo</p>
          <h1 className="mt-2 text-4xl font-semibold text-crema md:text-5xl">Proveedores</h1>
          <p className="mt-3 text-crema/80 md:text-lg">
            Elige un proveedor para ver sus productos, o busca directamente lo que necesitas y te diremos a quién se pide.
          </p>

          <Buscador
            className="mt-7 max-w-md"
            valor={busqueda}
            onCambiar={setBusqueda}
            etiqueta="Buscar proveedores o productos"
            placeholder="Busca un proveedor o un producto"
          />

          {!cargando && !error && (
            <ul className="mt-6 flex flex-wrap gap-2 text-sm text-crema">
              {[
                [proveedores.length, proveedores.length === 1 ? 'proveedor' : 'proveedores'],
                [productos.length, productos.length === 1 ? 'producto' : 'productos'],
                [numCategorias, numCategorias === 1 ? 'categoría' : 'categorías'],
              ].map(([numero, texto]) => (
                <li key={texto} className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20 backdrop-blur">
                  <span className="font-semibold">{numero}</span> {texto}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {esEmpleado && !puedePedir && (
        <p role="status" className="mt-6 rounded-2xl bg-terracota/10 px-5 py-4 text-cafe">
          Puedes consultar el catálogo, pero para hacer pedidos tu encargado tiene que añadirte a tu local.
        </p>
      )}

      {cargando && <p className="mt-12 text-center text-cafe-suave">Cargando el catálogo…</p>}

      {error && (
        <p role="alert" className="mt-12 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <>
          {texto && productosVisibles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold">
                Productos <span className="text-cafe-suave">({productosVisibles.length})</span>
              </h2>
              <div className="mt-5">
                <ListaProductos
                  productos={productosVisibles}
                  diasPorProveedor={diasPorProveedor}
                  puedePedir={puedePedir}
                  onCambiarCantidad={cambiarCantidad}
                />
              </div>
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-semibold">
              {texto ? 'Proveedores' : 'Todos los proveedores'}{' '}
              <span className="text-cafe-suave">({proveedoresVisibles.length})</span>
            </h2>

            {proveedoresVisibles.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-15px_rgb(43_33_27/0.2)]">
                <p className="text-xl font-semibold">No hay resultados</p>
                <p className="mt-2 text-cafe-suave">Prueba con otra palabra.</p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proveedoresVisibles.map((proveedor) => (
                  <li key={proveedor._id}>
                    <TarjetaProveedor
                      proveedor={proveedor}
                      productos={productosPorProveedor[proveedor._id] ?? []}
                      enPedido={pedido.numProductos > 0 && pedido.proveedor?._id === proveedor._id}
                      repartenHoy={repartenHoy(proveedor.dias_reparto)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {puedePedir && <BarraPedido />}
      {aviso}
    </section>
  )
}
