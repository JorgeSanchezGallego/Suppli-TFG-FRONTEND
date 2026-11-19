import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { pathname } = useLocation()
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        oculto && !menuAbierto ? '-translate-y-full' : 'translate-y-0'
      } ${transparente ? 'bg-transparent' : 'bg-crema/95 shadow-sm backdrop-blur'}`}
    >
      <nav className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 md:h-20">
        <div />

        <Link to="/" className="justify-self-center" aria-label="Suppli, ir al inicio">
          <Logo claro={transparente} />
        </Link>

        <div className="justify-self-end">
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/login"
              className={`font-medium transition-colors ${
                transparente ? 'text-crema hover:text-white' : 'text-cafe-suave hover:text-cafe'
              }`}
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-terracota px-5 py-2 font-medium text-crema transition-colors hover:bg-terracota-oscuro"
            >
              Registrarse
            </Link>
          </div>

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
          <Link to="/login" className="block py-3 font-medium text-cafe">
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="block rounded-full bg-terracota py-3 text-center font-medium text-crema"
          >
            Registrarse
          </Link>
        </div>
      )}
    </header>
  )
}
