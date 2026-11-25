import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { usePedido } from '../context/usePedido.js'
import { useCatalogo } from '../hooks/useCatalogo.js'
import { useCambiarCantidad } from '../hooks/useCambiarCantidad.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import ListaProductos from '../components/catalogo/ListaProductos.jsx'
import BarraPedido from '../components/catalogo/BarraPedido.jsx'
import { capitalizar, listaConY, normalizar, repartenHoy } from '../utils/formato.js'
import { localesParaPedir } from '../utils/pedidos.js'
import Volver from '../components/Volver.jsx'
import CabeceraOscura from '../components/CabeceraOscura.jsx'

export default function CatalogoProveedor() {
  const { proveedorId } = useParams()
  const { usuario } = useAuth()
  if (usuario.role === 'proveedor') {
    const propio = usuario.proveedor?._id ?? usuario.proveedor
    if (!propio || propio !== proveedorId) return <Navigate to={propio ? '/mi-catalogo' : '/panel'} replace />
  }
  return <Contenido proveedorId={proveedorId} />
}

function Contenido({ proveedorId }) {
  const { usuario } = useAuth()
  const pedido = usePedido()
  const { proveedores, productosPorProveedor, cargando, error } = useCatalogo()
  const { cambiarCantidad, aviso } = useCambiarCantidad()

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  const proveedor = proveedores.find((p) => p._id === proveedorId)
  const productos = useMemo(() => productosPorProveedor[proveedorId] ?? [], [productosPorProveedor, proveedorId])
  const puedePedir = localesParaPedir(usuario).length > 0

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
        <Volver className="" />
        <p className="mt-12 text-center text-cafe-suave">Cargando el proveedor…</p>
      </section>
    )
  }

  if (error || !proveedor) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <Volver className="" />
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
      <Volver className="" />

      <div className="mt-4">
        <CabeceraOscura etiqueta="Proveedor" titulo={proveedor.nombre_empresa}>
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-crema">
            <span className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
              Reparte {dias.length ? listaConY(dias) : 'sin días fijos'}
              {repartenHoy(dias) && <strong className="ml-1.5">· hoy</strong>}
            </span>
            <span className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20">
              Contacto: {proveedor.nombre_persona}
            </span>
            {proveedor.telefono && (
              <a
                href={`tel:${proveedor.telefono}`}
                className="rounded-full bg-crema/10 px-3.5 py-1.5 ring-1 ring-crema/20 transition hover:bg-crema/20"
              >
                Tel. {proveedor.telefono.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4')}
              </a>
            )}
            {enPedido && (
              <span className="rounded-full bg-terracota px-3.5 py-1.5 font-medium text-crema">Pedido en curso</span>
            )}
          </div>
          {usuario.role === 'encargado' && (
            <Link
              to={`/catalogo/${proveedor._id}/gestionar`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-crema px-5 py-2.5 text-sm font-medium text-cafe transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
              Gestionar catálogo
            </Link>
          )}
        </CabeceraOscura>
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
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
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
