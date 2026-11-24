import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function RutaEncargado() {
  const { usuario } = useAuth()
  if (usuario?.role !== 'encargado') return <Navigate to="/panel" replace />
  return <Outlet />
}
