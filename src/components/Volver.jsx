import { Link } from 'react-router-dom'

export default function Volver({ className = 'mb-4' }) {
  return (
    <Link
      to="/panel"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-terracota hover:text-terracota-oscuro ${className}`}
    >
      ← Volver al panel
    </Link>
  )
}
