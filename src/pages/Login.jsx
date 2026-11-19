import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import PantallaAcceso from '../components/formulario/PantallaAcceso.jsx'
import Campo from '../components/formulario/Campo.jsx'
import CampoContrasena from '../components/formulario/CampoContrasena.jsx'
import { contraseñaLogin, correo, sinErrores } from '../utils/validaciones.js'
import fotoLogin from '../assets/img/login3.avif'

export default function Login() {
  const { usuario, iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [datos, setDatos] = useState({ correo: '', contraseña: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario && !enviando) return <Navigate to="/panel" replace />

  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
    setErrorServidor('')
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevosErrores = {
      correo: correo(datos.correo),
      contraseña: contraseñaLogin(datos.contraseña),
    }
    setErrores(nuevosErrores)
    if (!sinErrores(nuevosErrores)) return

    setEnviando(true)
    try {
      await iniciarSesion(datos.correo.trim(), datos.contraseña)
      navigate(state?.desde ?? '/panel', { replace: true })
    } catch (error) {
      setErrorServidor(error.message)
      setEnviando(false)
    }
  }

  return (
    <PantallaAcceso foto={fotoLogin} frase="Cualquier compañero puede hacer un pedido sin depender de nadie.">
      <h1 className="text-3xl font-semibold sm:text-4xl">Bienvenido de nuevo</h1>
      <p className="mt-2 text-cafe-suave">Accede para hacer tus pedidos.</p>

      <form onSubmit={enviar} noValidate className="mt-10 space-y-5">
        <Campo
          id="correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={datos.correo}
          onChange={cambiar}
          error={errores.correo}
        />

        <CampoContrasena
          id="contraseña"
          etiqueta="Contraseña"
          autoComplete="current-password"
          value={datos.contraseña}
          onChange={cambiar}
          error={errores.contraseña}
        />

        {errorServidor && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorServidor}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full bg-terracota py-3 font-medium text-crema transition-colors hover:bg-terracota-oscuro disabled:cursor-wait disabled:opacity-70"
        >
          {enviando ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-8 text-center text-cafe-suave">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-terracota hover:text-terracota-oscuro">
          Regístrate
        </Link>
      </p>
    </PantallaAcceso>
  )
}
