import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import PedidoProvider from './context/PedidoProvider.jsx'
import { useAuth } from './context/useAuth.js'
import Layout from './components/Layout.jsx'
import RutaPrivada from './components/RutaPrivada.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import QuienesSomos from './pages/QuienesSomos.jsx'
import Panel from './pages/Panel.jsx'
import Catalogo from './pages/Catalogo.jsx'
import CatalogoProveedor from './pages/CatalogoProveedor.jsx'
import Pedido from './pages/Pedido.jsx'
import Historial from './pages/Historial.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Registro /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
      {
        element: <RutaPrivada />,
        children: [
          { path: 'panel', element: <Panel /> },
          { path: 'catalogo', element: <Catalogo /> },
          { path: 'catalogo/:proveedorId', element: <CatalogoProveedor /> },
          { path: 'pedido', element: <Pedido /> },
          { path: 'historial', element: <Historial /> },
        ],
      },
    ],
  },
])

function AppConPedido() {
  const { usuario } = useAuth()
  const usuarioId = usuario?._id ?? null

  return (
    <PedidoProvider key={usuarioId ?? 'sin-sesion'} usuarioId={usuarioId}>
      <RouterProvider router={router} />
    </PedidoProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppConPedido />
    </AuthProvider>
  )
}
