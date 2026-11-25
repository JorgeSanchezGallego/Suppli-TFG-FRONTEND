import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useProveedor } from '../hooks/useProveedor.js'
import { borrarProducto } from '../api/productos.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import Buscador from '../components/catalogo/Buscador.jsx'
import FormularioProducto from '../components/proveedor/FormularioProducto.jsx'
import { botonPrimario, tarjeta } from '../components/estilos.js'
import { capitalizar, euros, normalizar, numero } from '../utils/formato.js'
import Volver from '../components/Volver.jsx'

function FichaProducto({ producto, onEditar, onBorrado }) {
  const { token } = useAuth()
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')

  const borrar = async () => {
    setBorrando(true)
    setError('')
    try {
      await borrarProducto(token, producto._id)
      onBorrado()
    } catch (e) {
      setError(e.message)
      setBorrando(false)
    }
  }

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-white p-4 shadow-[0_18px_45px_-15px_rgb(43_33_27/0.22)]">
      <div className="flex gap-4">
        <img src={producto.imagen} alt="" loading="lazy" className="size-20 shrink-0 rounded-2xl bg-arena/40 object-cover" />
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">
            {capitalizar(producto.categoria)}
          </span>
          <h3 className="mt-1.5 leading-snug font-semibold">{producto.nombre}</h3>
          <p className="text-cafe-suave">
            <span className="font-semibold text-cafe">{euros(producto.precio)}</span> / {producto.medida}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-crema px-3 py-2">
          <dt className="text-xs text-cafe-suave">Stock invierno</dt>
          <dd className="font-semibold">{numero(producto.stock_optimo_invierno)}</dd>
        </div>
        <div className="rounded-xl bg-crema px-3 py-2">
          <dt className="text-xs text-cafe-suave">Stock verano</dt>
          <dd className="font-semibold">{numero(producto.stock_optimo_verano)}</dd>
        </div>
      </dl>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {confirmando ? (
          <>
            <span className="text-sm text-cafe-suave">¿Borrar este producto?</span>
            <button
              type="button"
              onClick={borrar}
              disabled={borrando}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {borrando ? 'Borrando…' : 'Sí, borrar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-full px-3 py-2 text-sm font-medium text-cafe-suave hover:bg-arena/40"
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEditar(producto)}
              className="rounded-full bg-terracota/15 px-4 py-2 text-sm font-medium text-terracota-oscuro ring-1 ring-terracota/60 transition hover:bg-terracota/25"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave ring-1 ring-arena hover:text-red-600 hover:ring-red-200"
            >
              Borrar
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export function GestionCatalogo({ empresa, productos, cargando, error, recargar, propio, children }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [formulario, setFormulario] = useState(null)

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es')),
    [productos],
  )

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda)
    return productos
      .filter((p) => !categoria || p.categoria === categoria)
      .filter((p) => !texto || normalizar(`${p.nombre} ${p.categoria}`).includes(texto))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [productos, busqueda, categoria])

  const cerrar = useCallback(() => setFormulario(null), [])
  const guardado = () => {
    setFormulario(null)
    recargar()
  }

  const chip = (activa) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
      activa ? 'bg-terracota text-crema' : 'bg-white text-cafe-suave ring-1 ring-arena hover:text-cafe'
    }`

  return (
    <section className="mx-auto max-w-5xl px-4 pt-28 pb-20">
      <Volver />

      <CabeceraOscura
        etiqueta={propio ? 'Mi catálogo' : 'Gestionar catálogo'}
        titulo={empresa?.nombre_empresa ?? (propio ? 'Tus productos' : 'Proveedor')}
      >
        <p className="mt-2 max-w-2xl text-crema/80">
          {propio
            ? 'Lo que añadas o cambies aquí lo verán al momento los bares en su catálogo.'
            : 'Añade o corrige productos de este proveedor. Los cambios los verán al momento todos los bares.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => setFormulario({})} className={`${botonPrimario} py-2.5`}>
            <span aria-hidden="true">+</span> Añadir producto
          </button>
          {empresa && (
            <Link
              to={`/catalogo/${empresa._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-crema/10 px-5 py-2.5 text-sm font-medium text-crema ring-1 ring-crema/30 transition hover:bg-crema/20"
            >
              {propio ? 'Ver como lo ven los bares' : 'Ver su catálogo'}
            </Link>
          )}
        </div>
      </CabeceraOscura>

      {cargando && <p className="mt-12 text-center text-cafe-suave">{propio ? 'Cargando tus productos…' : 'Cargando sus productos…'}</p>}

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {!cargando && !error && productos.length === 0 && (
        <div className={`${tarjeta} mt-8 p-10 text-center`}>
          <p className="text-xl font-semibold">{propio ? 'Todavía no tienes productos' : 'Este proveedor no tiene productos'}</p>
          <p className="mt-2 text-cafe-suave">{propio ? 'Añade el primero para que los bares puedan pedírtelo.' : 'Añade el primero para que los bares puedan pedirlo.'}</p>
          <button type="button" onClick={() => setFormulario({})} className={`${botonPrimario} mt-5`}>
            Añadir producto
          </button>
        </div>
      )}

      {!cargando && !error && productos.length > 0 && (
        <>
          <div className="mt-8 space-y-3">
            <Buscador
              valor={busqueda}
              onCambiar={setBusqueda}
              etiqueta="Buscar en mi catálogo"
              placeholder="Buscar por nombre o categoría"
              className="max-w-md"
            />
            {categorias.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                <button type="button" onClick={() => setCategoria('')} aria-pressed={!categoria} className={chip(!categoria)}>
                  Todas ({productos.length})
                </button>
                {categorias.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategoria(categoria === c ? '' : c)}
                    aria-pressed={categoria === c}
                    className={chip(categoria === c)}
                  >
                    {capitalizar(c)} ({productos.filter((p) => p.categoria === c).length})
                  </button>
                ))}
              </div>
            )}
          </div>

          {visibles.length === 0 ? (
            <p className="mt-10 text-center text-cafe-suave">No hay productos que coincidan.</p>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibles.map((producto) => (
                <li key={producto._id}>
                  <FichaProducto producto={producto} onEditar={setFormulario} onBorrado={recargar} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {children}

      {formulario && (
        <FormularioProducto
          producto={formulario._id ? formulario : null}
          proveedorId={empresa?._id}
          categorias={categorias}
          onCerrar={cerrar}
          onGuardado={guardado}
        />
      )}
    </section>
  )
}

export default function MiCatalogo() {
  const datos = useProveedor()
  return <GestionCatalogo {...datos} propio />
}
