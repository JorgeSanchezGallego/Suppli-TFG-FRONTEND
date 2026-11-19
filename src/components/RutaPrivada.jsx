import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function RutaPrivada() {
  const { usuario } = useAuth()
  const { pathname } = useLocation()

  if (!usuario) return <Navigate to="/login" replace state={{ desde: pathname }} />
  return <Outlet />
}
