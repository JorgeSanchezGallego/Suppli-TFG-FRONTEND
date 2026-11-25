import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function RutaProveedor() {
  const { usuario } = useAuth()
  if (usuario?.role !== 'proveedor' || !usuario.proveedor) return <Navigate to="/panel" replace />
  return <Outlet />
}
