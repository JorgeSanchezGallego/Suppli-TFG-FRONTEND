import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import QuienesSomos from './pages/QuienesSomos.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Registro /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
