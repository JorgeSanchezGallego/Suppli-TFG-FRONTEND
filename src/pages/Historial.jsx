import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { borrarPedido, cambiarEstadoPedido, obtenerHistorial } from '../api/pedidos.js'
import TarjetaPedido from '../components/historial/TarjetaPedido.jsx'
import { ESTADOS, puedeBorrar } from '../components/historial/estados.js'
import fotoCabecera from '../assets/img/hero.jpg'
import Volver from '../components/Volver.jsx'

const POR_PAGINA = 20

const SUBTITULOS = {
  empleado: 'Los pedidos de tus locales, hechos por ti o por tus compañeros.',
  encargado: 'Todos los pedidos de tus locales.',
  proveedor: 'Los pedidos que te han hecho los bares. Ábrelos para ver qué llevar y a qué dirección.',
}

export default function Historial() {
  const { usuario, token } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState('')
  const [local, setLocal] = useState('')
  const [limite, setLimite] = useState(POR_PAGINA)

  const filtrarEstado = (valor) => {
    setEstado(valor)
    setLimite(POR_PAGINA)
  }

  const filtrarLocal = (valor) => {
    setLocal(valor)
    setLimite(POR_PAGINA)
  }

  const sinLocal = usuario.role === 'empleado' && (usuario.bares ?? []).length === 0

  useEffect(() => {
    let cancelado = false
    obtenerHistorial(token)
      .then((lista) => {
        if (!cancelado) setPedidos(lista)
      })
      .catch((e) => {
        if (!cancelado) setError(e.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [token])

  const locales = useMemo(() => {
    const mapa = new Map()
    for (const p of pedidos) if (p.bar?._id) mapa.set(p.bar._id, p.bar.nombre)
    return [...mapa.entries()].sort((a, b) => a[1].localeCompare(b[1], 'es'))
  }, [pedidos])

  const delLocal = local ? pedidos.filter((p) => p.bar?._id === local) : pedidos
  const visibles = estado ? delLocal.filter((p) => p.estado === estado) : delLocal
  const mostrados = visibles.slice(0, limite)
  const restantes = visibles.length - mostrados.length
  const cuenta = (e) => delLocal.filter((p) => p.estado === e).length

  const cambiarEstado = async (pedido, nuevo) => {
    const actualizado = await cambiarEstadoPedido(token, pedido._id, nuevo)
    setPedidos((lista) => lista.map((p) => (p._id === pedido._id ? { ...p, ...actualizado } : p)))
  }

  const borrar = async (pedido) => {
    await borrarPedido(token, pedido._id)
    setPedidos((lista) => lista.filter((p) => p._id !== pedido._id))
  }

  const chip = (activa) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
      activa ? 'bg-terracota text-crema' : 'bg-white text-cafe-suave ring-1 ring-arena hover:text-cafe'
    }`

  return (
    <section className="mx-auto max-w-5xl px-4 pt-28 pb-20">
      <Volver />
      <header className="relative overflow-hidden rounded-[2rem] bg-cafe px-6 py-10 shadow-[0_30px_70px_-20px_rgb(43_33_27/0.55)] sm:px-10 md:px-14 md:py-12">
        <img src={fotoCabecera} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-linear-to-r from-cafe via-cafe/85 to-terracota/50" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-medium tracking-[0.25em] text-crema/70 uppercase">Historial</p>
          <h1 className="mt-2 text-4xl font-semibold text-crema md:text-5xl">
            {usuario.role === 'proveedor' ? 'Pedidos recibidos' : 'Pedidos'}
          </h1>
          <p className="mt-3 text-crema/80 md:text-lg">{SUBTITULOS[usuario.role]}</p>
        </div>
      </header>

      {sinLocal ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-15px_rgb(43_33_27/0.2)]">
          <p className="text-xl font-semibold">Aún no tienes un local asignado</p>
          <p className="mt-2 text-cafe-suave">Cuando tu encargado te añada a su local, verás aquí sus pedidos.</p>
        </div>
      ) : (
        <>
          {!cargando && !error && pedidos.length > 0 && (
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
                <button type="button" onClick={() => filtrarEstado('')} aria-pressed={!estado} className={chip(!estado)}>
                  Todos ({delLocal.length})
                </button>
                {Object.entries(ESTADOS).map(([clave, { texto }]) => (
                  <button
                    key={clave}
                    type="button"
                    onClick={() => filtrarEstado(estado === clave ? '' : clave)}
                    aria-pressed={estado === clave}
                    className={chip(estado === clave)}
                  >
                    {texto} ({cuenta(clave)})
                  </button>
                ))}
              </div>

              {locales.length > 1 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por local">
                  <button type="button" onClick={() => filtrarLocal('')} aria-pressed={!local} className={chip(!local)}>
                    Todos los locales
                  </button>
                  {locales.map(([idLocal, nombre]) => (
                    <button
                      key={idLocal}
                      type="button"
                      onClick={() => filtrarLocal(local === idLocal ? '' : idLocal)}
                      aria-pressed={local === idLocal}
                      className={chip(local === idLocal)}
                    >
                      {nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {cargando && <p className="mt-12 text-center text-cafe-suave">Cargando pedidos…</p>}

          {error && (
            <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
              {error}
            </p>
          )}

          {!cargando && !error && pedidos.length === 0 && (
            <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-15px_rgb(43_33_27/0.2)]">
              <p className="text-xl font-semibold">Todavía no hay pedidos</p>
              {usuario.role === 'empleado' && (
                <Link
                  to="/catalogo"
                  className="mt-5 inline-block rounded-full bg-terracota px-6 py-3 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
                >
                  Hacer el primero
                </Link>
              )}
            </div>
          )}

          {!cargando && !error && pedidos.length > 0 && visibles.length === 0 && (
            <p className="mt-10 text-center text-cafe-suave">No hay pedidos con este filtro.</p>
          )}

          <ul className="mt-6 space-y-4">
            {mostrados.map((pedido) => (
              <li key={pedido._id}>
                <TarjetaPedido
                  pedido={pedido}
                  role={usuario.role}
                  onCambiarEstado={cambiarEstado}
                  onBorrar={puedeBorrar(pedido, usuario) ? borrar : undefined}
                />
              </li>
            ))}
          </ul>

          {visibles.length > POR_PAGINA && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-sm text-cafe-suave">
                Mostrando {mostrados.length} de {visibles.length} pedidos
              </p>
              {restantes > 0 && (
                <button
                  type="button"
                  onClick={() => setLimite(limite + POR_PAGINA)}
                  className="rounded-full bg-terracota/15 px-6 py-3 font-medium text-terracota-oscuro shadow-sm ring-1 ring-terracota/60 transition hover:bg-terracota/25 hover:ring-terracota"
                >
                  Ver {Math.min(restantes, POR_PAGINA)} más
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
