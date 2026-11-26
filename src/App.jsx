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
import PoliticaCookies from './pages/PoliticaCookies.jsx'
import Panel from './pages/Panel.jsx'
import Catalogo from './pages/Catalogo.jsx'
import CatalogoProveedor from './pages/CatalogoProveedor.jsx'
import Pedido from './pages/Pedido.jsx'
import Historial from './pages/Historial.jsx'
import MisLocales from './pages/MisLocales.jsx'
import DetalleLocal from './pages/DetalleLocal.jsx'
import Empleados from './pages/Empleados.jsx'
import RutaEncargado from './components/RutaEncargado.jsx'
import RutaProveedor from './components/RutaProveedor.jsx'
import RutaNoProveedor from './components/RutaNoProveedor.jsx'
import MiCatalogo from './pages/MiCatalogo.jsx'
import MiEmpresa from './pages/MiEmpresa.jsx'
import GestionarCatalogo from './pages/GestionarCatalogo.jsx'
import NuevoProveedor from './pages/NuevoProveedor.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Registro /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
      { path: 'politica-cookies', element: <PoliticaCookies /> },
      {
        element: <RutaPrivada />,
        children: [
          { path: 'panel', element: <Panel /> },
          {
            element: <RutaNoProveedor />,
            children: [
              { path: 'catalogo', element: <Catalogo /> },
              { path: 'pedido', element: <Pedido /> },
            ],
          },
          { path: 'catalogo/:proveedorId', element: <CatalogoProveedor /> },
          { path: 'historial', element: <Historial /> },
          {
            element: <RutaEncargado />,
            children: [
              { path: 'mis-locales', element: <MisLocales /> },
              { path: 'mis-locales/:id', element: <DetalleLocal /> },
              { path: 'empleados', element: <Empleados /> },
              { path: 'catalogo/:proveedorId/gestionar', element: <GestionarCatalogo /> },
              { path: 'proveedores/nuevo', element: <NuevoProveedor /> },
            ],
          },
          {
            element: <RutaProveedor />,
            children: [
              { path: 'mi-catalogo', element: <MiCatalogo /> },
              { path: 'mi-empresa', element: <MiEmpresa /> },
            ],
          },
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
