import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { crearProveedor } from '../api/proveedores.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import FormularioProveedor from '../components/proveedor/FormularioProveedor.jsx'
import Volver from '../components/Volver.jsx'

export default function NuevoProveedor() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const crear = async (datos) => {
    const proveedor = await crearProveedor(token, datos)
    navigate(`/catalogo/${proveedor._id}/gestionar`, { replace: true })
    return false
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-28 pb-20">
      <Volver />

      <CabeceraOscura etiqueta="Proveedores" titulo="Nuevo proveedor">
        <p className="mt-2 text-crema/80">
          Da de alta un proveedor con el que trabajéis. Después podrás añadir sus productos para que los bares puedan pedírselos.
        </p>
      </CabeceraOscura>

      <FormularioProveedor onEnviar={crear} textoBoton="Crear proveedor" />
    </section>
  )
}
