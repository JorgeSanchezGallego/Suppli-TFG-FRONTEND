import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import fotoLogin from '../assets/img/login3.avif'

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ correo, contraseña }) {
  const errores = {}
  if (!correo.trim()) errores.correo = 'Escribe tu correo electrónico.'
  else if (!FORMATO_CORREO.test(correo.trim())) errores.correo = 'Ese correo no tiene un formato válido.'
  if (!contraseña) errores.contraseña = 'Escribe tu contraseña.'
  else if (contraseña.length < 8) errores.contraseña = 'La contraseña tiene al menos 8 caracteres.'
  return errores
}

const campo =
  'w-full rounded-xl border bg-white px-4 py-3 text-cafe outline-none transition placeholder:text-cafe-suave/60 focus:border-terracota focus:ring-4 focus:ring-terracota/15'

export default function Login() {
  const { usuario, iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [datos, setDatos] = useState({ correo: '', contraseña: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [verContraseña, setVerContraseña] = useState(false)
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
    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

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
    <section className="relative min-h-svh overflow-hidden">
      <img src={fotoLogin} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-cafe/45 md:bg-transparent md:bg-linear-to-r md:from-cafe/80 md:via-cafe/45 md:to-cafe/20" />

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-4 pt-28 pb-16 md:grid-cols-2 md:px-8">
        <div className="hidden md:block">
          <p className="text-sm font-medium tracking-[0.25em] text-crema/80 uppercase">Gestor de pedidos</p>
          <p className="mt-3 max-w-md text-3xl leading-snug font-semibold text-crema lg:text-5xl lg:leading-tight">
            Cualquier compañero puede hacer un pedido sin depender de nadie.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-sm rounded-3xl bg-crema/95 p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.5)] backdrop-blur sm:p-8 md:max-w-md md:p-10 lg:p-12">
            <h1 className="text-3xl font-semibold sm:text-4xl">Bienvenido de nuevo</h1>
            <p className="mt-2 text-cafe-suave">Accede para hacer tus pedidos.</p>

            <form onSubmit={enviar} noValidate className="mt-10 space-y-5">
              <div>
                <label htmlFor="correo" className="mb-1.5 block text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  value={datos.correo}
                  onChange={cambiar}
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? 'error-correo' : undefined}
                  className={`${campo} ${errores.correo ? 'border-red-400' : 'border-arena'}`}
                />
                {errores.correo && (
                  <p id="error-correo" className="mt-1.5 text-sm text-red-600">
                    {errores.correo}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contraseña" className="mb-1.5 block text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="contraseña"
                    name="contraseña"
                    type={verContraseña ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={datos.contraseña}
                    onChange={cambiar}
                    aria-invalid={Boolean(errores.contraseña)}
                    aria-describedby={errores.contraseña ? 'error-contraseña' : undefined}
                    className={`${campo} pr-12 ${errores.contraseña ? 'border-red-400' : 'border-arena'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setVerContraseña(!verContraseña)}
                    aria-label={verContraseña ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={verContraseña}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-cafe-suave hover:text-cafe"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                      {verContraseña && <path d="M3 3l18 18" />}
                    </svg>
                  </button>
                </div>
                {errores.contraseña && (
                  <p id="error-contraseña" className="mt-1.5 text-sm text-red-600">
                    {errores.contraseña}
                  </p>
                )}
              </div>

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
          </div>
        </div>
      </div>
    </section>
  )
}
