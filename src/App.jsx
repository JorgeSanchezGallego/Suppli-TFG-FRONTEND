import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import Layout from './components/Layout.jsx'
import RutaPrivada from './components/RutaPrivada.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import QuienesSomos from './pages/QuienesSomos.jsx'
import Panel from './pages/Panel.jsx'

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
        children: [{ path: 'panel', element: <Panel /> }],
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
