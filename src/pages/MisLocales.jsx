import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useEncargado } from '../hooks/useEncargado.js'
import { crearBar } from '../api/bares.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import TarjetaMiLocal from '../components/TarjetaMiLocal.jsx'
import OtrosEncargados from '../components/encargado/OtrosEncargados.jsx'
import Campo from '../components/formulario/Campo.jsx'
import SelectorFoto from '../components/encargado/SelectorFoto.jsx'
import { botonPrimario, botonSecundario, tarjeta } from '../components/estilos.js'
import { obligatorio, sinErrores, validarFoto } from '../utils/validaciones.js'

function NuevoLocal({ onCancelar }) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', ubicacion: '' })
  const [foto, setFoto] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevos = {
      nombre: obligatorio(datos.nombre, 'Escribe el nombre del local.'),
      ubicacion: obligatorio(datos.ubicacion, 'Escribe la dirección del local.'),
      foto: validarFoto(foto) || undefined,
    }
    setErrores(nuevos)
    if (!sinErrores(nuevos)) return

    setGuardando(true)
    try {
      const bar = await crearBar(token, {
        nombre: datos.nombre.trim(),
        ubicacion: datos.ubicacion.trim(),
        imagen: foto,
      })
      navigate(`/mis-locales/${bar._id}`)
    } catch (error) {
      setErrorServidor(error.message)
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className={`${tarjeta} mt-8 p-6 md:p-8`}>
      <h2 className="text-2xl font-semibold">Nuevo local</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Campo id="nombre" etiqueta="Nombre" placeholder="Kiosko Gómiz" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
        <div>
          <Campo
            id="ubicacion"
            etiqueta="Dirección"
            placeholder="Paseo de Gómiz, 03002 Alicante"
            value={datos.ubicacion}
            onChange={cambiar}
            error={errores.ubicacion}
          />
          {!errores.ubicacion && <p className="mt-1.5 text-xs text-cafe-suave">La dirección no se podrá cambiar después.</p>}
        </div>
        <div className="md:col-span-2">
          <SelectorFoto
            archivo={foto}
            onCambiar={(archivo) => {
              setFoto(archivo)
              setErrores({ ...errores, foto: validarFoto(archivo) || undefined })
            }}
            error={errores.foto}
          />
        </div>
      </div>

      {errorServidor && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorServidor}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onCancelar} className={botonSecundario}>
          Cancelar
        </button>
        <button type="submit" disabled={guardando} className={botonPrimario}>
          {guardando ? 'Creando…' : 'Crear local'}
        </button>
      </div>
    </form>
  )
}

export default function MisLocales() {
  const { bares, empleadosPorBar, pendientesPorBar, cargando, error } = useEncargado()
  const [creando, setCreando] = useState(false)

  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 pb-20">
      <Link to="/panel" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracota hover:text-terracota-oscuro">
        ← Volver al panel
      </Link>

      <CabeceraOscura etiqueta="Gestión" titulo="Mis locales">
        <p className="mt-3 max-w-2xl text-crema/80 md:text-lg">
          Crea tus locales y elige qué empleados trabajan en cada uno. Solo los empleados de un local pueden hacer pedidos
          para él.
        </p>
        {!creando && (
          <button type="button" onClick={() => setCreando(true)} className={`${botonPrimario} mt-6`}>
            + Nuevo local
          </button>
        )}
      </CabeceraOscura>

      {creando && <NuevoLocal onCancelar={() => setCreando(false)} />}

      {cargando && <p className="mt-12 text-center text-cafe-suave">Cargando tus locales…</p>}

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {!cargando && !error && bares.length === 0 && !creando && (
        <div className={`${tarjeta} mt-8 p-10 text-center`}>
          <p className="text-xl font-semibold">Todavía no tienes locales</p>
          <p className="mt-2 text-cafe-suave">Crea el primero para empezar a añadir empleados.</p>
        </div>
      )}

      {bares.length > 0 && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bares.map((bar) => {
            const empleados = empleadosPorBar[bar._id]?.length ?? 0
            const pendientes = pendientesPorBar[bar._id] ?? 0
            return (
              <li key={bar._id}>
                <TarjetaMiLocal bar={bar} to={`/mis-locales/${bar._id}`}>
                  <p className="pt-2 text-sm text-cafe">
                    {empleados} {empleados === 1 ? 'empleado' : 'empleados'} · {pendientes}{' '}
                    {pendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
                  </p>
                  <OtrosEncargados bar={bar} />
                </TarjetaMiLocal>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
