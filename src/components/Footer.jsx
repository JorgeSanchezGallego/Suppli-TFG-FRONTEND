import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

const LINKEDIN = 'https://www.linkedin.com/in/jorge-sanchez-gallego/'
const CORREO = 'jorgesanchezluky@gmail.com'
const ANIO = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-cafe text-crema/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo claro />
          <p className="text-sm">Gestor de pedidos a proveedores para hostelería.</p>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-crema">Jorge Sánchez Gallego</p>
          <p className="text-sm">TFG de Desarrollo de Aplicaciones Web</p>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-crema">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z" />
              </svg>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${CORREO}`} className="inline-flex items-center gap-2 hover:text-crema">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {CORREO}
            </a>
          </li>
          <li>
            <Link to="/quienes-somos" className="hover:text-crema">
              Quiénes somos
            </Link>
          </li>
          <li>
            <Link to="/politica-cookies" className="hover:text-crema">
              Política de cookies
            </Link>
          </li>
        </ul>
      </div>

      <div className="border-t border-crema/10 py-5 text-center text-xs">
        © {ANIO} Jorge Sánchez Gallego. Todos los derechos reservados.
      </div>
    </footer>
  )
}
