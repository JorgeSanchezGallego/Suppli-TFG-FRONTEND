import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import Logo from './Logo.jsx'
import CarritoMenu from './CarritoMenu.jsx'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  const [conFondo, setConFondo] = useState(false)
  const [oculto, setOculto] = useState(false)
  const [menuAbiertoEn, setMenuAbiertoEn] = useState(null)
  const menuAbierto = menuAbiertoEn === pathname
  const ultimoScroll = useRef(0)

  useEffect(() => {
    const alHacerScroll = () => {
      const y = window.scrollY
      setConFondo(y > 40)
      setOculto(y > ultimoScroll.current && y > 120)
      ultimoScroll.current = y
    }
    alHacerScroll()
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [])

  const transparente = pathname === '/' && !conFondo && !menuAbierto
  const puedePedir = usuario?.role === 'empleado' && (usuario.bares ?? []).length > 0

  const enlace = transparente ? 'text-crema hover:text-white' : 'text-cafe-suave hover:text-cafe'
  const activo = transparente ? 'text-white' : 'text-terracota'
  const botonSecundario = `rounded-full border font-medium transition-colors ${
    transparente
      ? 'border-crema/50 text-crema hover:bg-crema/10'
      : 'border-cafe/20 text-cafe hover:border-cafe/40 hover:bg-arena/40'
  }`

  const salir = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        oculto && !menuAbierto ? '-translate-y-full' : 'translate-y-0'
      } ${transparente ? 'bg-transparent' : 'bg-crema/95 shadow-sm backdrop-blur'}`}
    >
      <nav className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 md:h-20">
        <div className="hidden items-center gap-6 md:flex">
          {usuario && (
            <>
              <NavLink to="/panel" className={({ isActive }) => `font-medium transition-colors ${isActive ? activo : enlace}`}>
                Panel
              </NavLink>
              <NavLink to="/catalogo" className={({ isActive }) => `font-medium transition-colors ${isActive ? activo : enlace}`}>
                Catálogo
              </NavLink>
              <NavLink to="/historial" className={({ isActive }) => `font-medium transition-colors ${isActive ? activo : enlace}`}>
                Pedidos
              </NavLink>
            </>
          )}
        </div>
        <div className="md:hidden" />

        <Link to="/" className="justify-self-center" aria-label="Suppli, ir al inicio">
          <Logo claro={transparente} />
        </Link>

        <div className="flex items-center gap-2 justify-self-end md:gap-4">
          <div className="hidden items-center gap-6 md:flex">
            {usuario ? (
              <>
                <Link to="/panel" className={`font-medium transition-colors ${enlace}`}>
                  Hola, {usuario.nombre}
                </Link>
                <button type="button" onClick={salir} className={`${botonSecundario} px-5 py-2`}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`font-medium transition-colors ${enlace}`}>
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-terracota px-5 py-2 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {puedePedir && <CarritoMenu claro={transparente} />}

          <button
            type="button"
            onClick={() => setMenuAbiertoEn(menuAbierto ? null : pathname)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className={`grid size-10 place-items-center rounded-lg md:hidden ${
              transparente ? 'text-crema' : 'text-cafe'
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuAbierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuAbierto && (
        <div id="menu-movil" className="border-t border-arena px-4 pb-4 md:hidden">
          {usuario ? (
            <>
              <Link to="/panel" className="block py-3 font-medium text-cafe">
                Hola, {usuario.nombre}
              </Link>
              <Link to="/catalogo" className="block py-3 font-medium text-cafe">
                Catálogo
              </Link>
              <Link to="/historial" className="mb-2 block py-3 font-medium text-cafe">
                Pedidos
              </Link>
              <button
                type="button"
                onClick={salir}
                className="block w-full rounded-full border border-cafe/20 py-3 text-center font-medium text-cafe"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-3 font-medium text-cafe">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="block rounded-full bg-terracota py-3 text-center font-medium text-crema"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
