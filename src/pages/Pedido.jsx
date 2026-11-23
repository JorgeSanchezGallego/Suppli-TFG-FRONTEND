import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { usePedido } from '../context/usePedido.js'
import { obtenerProveedor } from '../api/proveedores.js'
import { crearPedido } from '../api/pedidos.js'
import SelectorCantidad from '../components/catalogo/SelectorCantidad.jsx'
import { cantidadConMedida, euros } from '../utils/formato.js'
import { enlaceWhatsApp, mensajePedido } from '../utils/whatsapp.js'

const tarjeta = 'rounded-3xl bg-white p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.22)] md:p-8'

function Contenedor({ children }) {
  return <section className="mx-auto max-w-5xl px-4 pt-32 pb-20">{children}</section>
}

function PedidoEnviado({ enviado }) {
  return (
    <Contenedor>
      <div className={`${tarjeta} mx-auto max-w-xl text-center`}>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-terracota/10 text-terracota">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Pedido guardado</h1>
        <p className="mt-3 leading-relaxed text-cafe-suave">
          Hemos abierto WhatsApp con el mensaje para <strong className="text-cafe">{enviado.proveedor}</strong>. Solo
          tienes que pulsar enviar. El pedido ya está registrado en el historial.
        </p>
        <a
          href={enviado.enlace}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 font-medium text-white transition hover:brightness-95"
        >
          Abrir WhatsApp otra vez
        </a>
        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to="/catalogo" className="rounded-full border border-cafe/20 px-5 py-2.5 font-medium hover:bg-arena/40">
            Hacer otro pedido
          </Link>
          <Link to="/historial" className="rounded-full border border-cafe/20 px-5 py-2.5 font-medium hover:bg-arena/40">
            Ver pedidos
          </Link>
        </div>
      </div>
    </Contenedor>
  )
}

export default function Pedido() {
  const { usuario, token } = useAuth()
  const pedido = usePedido()
  const bares = (usuario.bares ?? []).filter((bar) => typeof bar === 'object')
  const puedePedir = usuario.role === 'empleado' && bares.length > 0

  const [proveedor, setProveedor] = useState(null)
  const [errorProveedor, setErrorProveedor] = useState('')
  const [barElegido, setBarElegido] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviado, setEnviado] = useState(null)

  const proveedorId = pedido.proveedor?._id

  useEffect(() => {
    if (!proveedorId) return
    let cancelado = false
    obtenerProveedor(token, proveedorId)
      .then((datos) => {
        if (!cancelado) setProveedor(datos)
      })
      .catch((e) => {
        if (!cancelado) setErrorProveedor(e.message)
      })
    return () => {
      cancelado = true
    }
  }, [token, proveedorId])

  if (enviado) return <PedidoEnviado enviado={enviado} />

  if (!puedePedir) {
    return (
      <Contenedor>
        <div className={`${tarjeta} text-center`}>
          <h1 className="text-2xl font-semibold">Aún no puedes hacer pedidos</h1>
          <p className="mt-2 text-cafe-suave">Tu encargado tiene que añadirte a tu local.</p>
        </div>
      </Contenedor>
    )
  }

  if (pedido.numProductos === 0) {
    return (
      <Contenedor>
        <div className={`${tarjeta} mx-auto max-w-xl text-center`}>
          <h1 className="text-2xl font-semibold">Tu pedido está vacío</h1>
          <p className="mt-2 text-cafe-suave">Añade productos desde el catálogo para preparar un pedido.</p>
          <Link
            to="/catalogo"
            className="mt-6 inline-block rounded-full bg-terracota px-6 py-3 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
          >
            Ir al catálogo
          </Link>
        </div>
      </Contenedor>
    )
  }

  const bar = bares.find((b) => b._id === barElegido) ?? bares[0]
  const datosProveedor = proveedor ?? pedido.proveedor
  const mensaje = mensajePedido({ proveedor: datosProveedor, bar, lineas: pedido.lineas })
  const sinTelefono = proveedor && !proveedor.telefono

  const enviar = async () => {
    setErrorEnvio('')
    const ventana = window.open('', '_blank')
    setEnviando(true)
    try {
      await crearPedido(token, { proveedor: proveedorId, bar: bar._id, lineas: pedido.lineas })
      const enlace = enlaceWhatsApp(proveedor.telefono, mensaje)
      if (ventana) {
        ventana.opener = null
        ventana.location.href = enlace
      } else {
        window.open(enlace, '_blank', 'noreferrer')
      }
      setEnviado({ enlace, proveedor: pedido.proveedor.nombre_empresa })
      pedido.vaciar()
    } catch (error) {
      ventana?.close()
      setErrorEnvio(error.message)
      setEnviando(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 pt-32 pb-20">
      <Link
        to={`/catalogo/${proveedorId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracota hover:text-terracota-oscuro"
      >
        ← Seguir añadiendo productos
      </Link>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Revisa tu pedido</h1>
      <p className="mt-2 text-lg text-cafe-suave">
        Pedido a <strong className="text-cafe">{pedido.proveedor.nombre_empresa}</strong>
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <div className={tarjeta}>
          <h2 className="text-xl font-semibold">Productos</h2>
          <ul className="mt-4 divide-y divide-arena">
            {pedido.lineas.map(({ producto, cantidad }) => (
              <li key={producto._id} className="flex flex-wrap items-center gap-4 py-4">
                <img src={producto.imagen} alt="" className="size-14 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-cafe-suave">
                    {euros(producto.precio)} / {producto.medida} · {cantidadConMedida(cantidad, producto.medida)}
                  </p>
                </div>
                <SelectorCantidad
                  compacto
                  producto={producto}
                  cantidad={cantidad}
                  onCambiar={(nueva) => pedido.cambiarCantidad(producto, nueva)}
                />
                <p className="w-20 text-right font-semibold">{euros(producto.precio * cantidad)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-arena pt-4">
            <span className="text-cafe-suave">Total aproximado</span>
            <span className="text-2xl font-semibold">{euros(pedido.total)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className={tarjeta}>
            <h2 className="text-xl font-semibold">¿Desde qué local pides?</h2>
            {bares.length === 1 ? (
              <p className="mt-3 rounded-2xl bg-arena/40 px-4 py-3">
                <span className="font-medium">{bar.nombre}</span>
                {bar.ubicacion && <span className="block text-sm text-cafe-suave">{bar.ubicacion}</span>}
              </p>
            ) : (
              <div className="mt-3 space-y-2" role="radiogroup" aria-label="Local del pedido">
                {bares.map((b) => (
                  <label
                    key={b._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 ring-1 transition ${
                      b._id === bar._id ? 'bg-terracota/10 ring-terracota' : 'ring-arena hover:bg-arena/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bar"
                      value={b._id}
                      checked={b._id === bar._id}
                      onChange={() => setBarElegido(b._id)}
                      className="mt-1 accent-terracota"
                    />
                    <span>
                      <span className="font-medium">{b.nombre}</span>
                      {b.ubicacion && <span className="block text-sm text-cafe-suave">{b.ubicacion}</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={tarjeta}>
            <h2 className="text-xl font-semibold">Mensaje para el proveedor</h2>
            <p className="mt-1 text-sm text-cafe-suave">
              Se abrirá WhatsApp con este mensaje
              {proveedor?.telefono && <> para el {proveedor.telefono}</>}.
            </p>
            <div className="mt-4 rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-[#1f2c34]">
              {mensaje}
            </div>

            {errorProveedor && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorProveedor}
              </p>
            )}
            {sinTelefono && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Este proveedor no tiene teléfono guardado, así que no se puede enviar por WhatsApp.
              </p>
            )}
            {errorEnvio && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorEnvio}
              </p>
            )}

            <button
              type="button"
              onClick={enviar}
              disabled={enviando || !proveedor || sinTelefono}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] py-3.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgb(37_211_102/0.7)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
              </svg>
              {enviando ? 'Guardando pedido…' : 'Enviar por WhatsApp'}
            </button>
            <p className="mt-3 text-center text-xs text-cafe-suave">
              El pedido se guarda en el historial y se abre WhatsApp para que lo envíes.
            </p>

            <div role="note" className="mt-5 flex gap-3 rounded-2xl bg-arena/50 px-4 py-3 text-sm text-cafe">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-terracota" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 7.5h.01" />
              </svg>
              <p>
                <strong className="font-semibold">Todo pedido necesita la confirmación del proveedor</strong> fuera de
                esta aplicación. Espera su respuesta por WhatsApp antes de darlo por hecho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
