import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { usePedido } from '../context/usePedido.js'
import { useCatalogo } from '../hooks/useCatalogo.js'
import { useCambiarCantidad } from '../hooks/useCambiarCantidad.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import ListaProductos from '../components/catalogo/ListaProductos.jsx'
import BarraPedido from '../components/catalogo/BarraPedido.jsx'
import { capitalizar, listaConY, normalizar, repartenHoy } from '../utils/formato.js'

function Volver() {
  return (
    <Link to="/catalogo" className="inline-flex items-center gap-1.5 text-sm font-medium text-terracota hover:text-terracota-oscuro">
      ← Todos los proveedores
    </Link>
  )
}

export default function CatalogoProveedor() {
  const { proveedorId } = useParams()
  const { usuario } = useAuth()
  const pedido = usePedido()
  const { proveedores, productosPorProveedor, cargando, error } = useCatalogo()
  const { cambiarCantidad, aviso } = useCambiarCantidad()

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  const proveedor = proveedores.find((p) => p._id === proveedorId)
  const productos = useMemo(() => productosPorProveedor[proveedorId] ?? [], [productosPorProveedor, proveedorId])
  const puedePedir = usuario.role === 'empleado' && (usuario.bares ?? []).length > 0

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es')),
    [productos],
  )

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda)
    return productos.filter(
      (p) => (!categoria || p.categoria === categoria) && (!texto || normalizar(p.nombre).includes(texto)),
    )
  }, [productos, busqueda, categoria])

  const chip = (activa) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
      activa ? 'bg-terracota text-crema' : 'bg-white text-cafe-suave ring-1 ring-arena hover:text-cafe'
    }`

  if (cargando) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <Volver />
        <p className="mt-12 text-center text-cafe-suave">Cargando el proveedor…</p>
      </section>
    )
  }

  if (error || !proveedor) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <Volver />
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error || 'No hemos encontrado este proveedor.'}
        </p>
      </section>
    )
  }

  const dias = proveedor.dias_reparto ?? []
  const enPedido = pedido.numProductos > 0 && pedido.proveedor?._id === proveedor._id

  return (
    <section className={`mx-auto max-w-6xl px-4 pt-32 ${pedido.numProductos > 0 ? 'pb-48' : 'pb-20'}`}>
      <Volver />

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-2xl bg-terracota/10 text-3xl font-semibold text-terracota"
        >
          {proveedor.nombre_empresa.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold md:text-5xl">{proveedor.nombre_empresa}</h1>
          <p className="mt-2 text-cafe-suave">
            Contacto: {proveedor.nombre_persona} · Reparte {dias.length ? listaConY(dias) : 'sin días fijos'}
            {repartenHoy(dias) && <span className="ml-1.5 font-medium text-terracota">· hoy</span>}
          </p>
        </div>
        {enPedido && (
          <span className="rounded-full bg-terracota px-3 py-1 text-sm font-medium text-crema">Pedido en curso</span>
        )}
      </div>

      {usuario.role === 'empleado' && !puedePedir && (
        <p role="status" className="mt-6 rounded-2xl bg-terracota/10 px-5 py-4 text-cafe">
          Puedes consultar el catálogo, pero para hacer pedidos tu encargado tiene que añadirte a tu local.
        </p>
      )}

      <div className="mt-8 space-y-4">
        <Buscador
          className="max-w-md"
          valor={busqueda}
          onCambiar={setBusqueda}
          etiqueta={`Buscar productos de ${proveedor.nombre_empresa}`}
          placeholder={`Busca en ${proveedor.nombre_empresa}`}
        />
        {categorias.length > 1 && (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por categoría">
            <button type="button" onClick={() => setCategoria('')} aria-pressed={!categoria} className={chip(!categoria)}>
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(categoria === c ? '' : c)}
                aria-pressed={categoria === c}
                className={chip(categoria === c)}
              >
                {capitalizar(c)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        {visibles.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-15px_rgb(43_33_27/0.2)]">
            <p className="text-xl font-semibold">
              {productos.length === 0 ? 'Este proveedor todavía no tiene productos' : 'No hay productos que coincidan'}
            </p>
          </div>
        ) : (
          <ListaProductos
            productos={visibles}
            diasPorProveedor={{ [proveedor._id]: dias }}
            puedePedir={puedePedir}
            onCambiarCantidad={cambiarCantidad}
          />
        )}
      </div>

      {puedePedir && <BarraPedido />}
      {aviso}
    </section>
  )
}
