import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function RutaNoProveedor() {
  const { usuario } = useAuth()
  if (usuario?.role === 'proveedor') return <Navigate to={usuario.proveedor ? '/mi-catalogo' : '/panel'} replace />
  return <Outlet />
}
