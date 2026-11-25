import { useAuth } from '../context/useAuth.js'
import { useProveedor } from '../hooks/useProveedor.js'
import { editarProveedor } from '../api/proveedores.js'
import CabeceraOscura from '../components/CabeceraOscura.jsx'
import FormularioProveedor from '../components/proveedor/FormularioProveedor.jsx'
import Volver from '../components/Volver.jsx'

export default function MiEmpresa() {
  const { token } = useAuth()
  const { empresa, cargando, error, recargar } = useProveedor()

  const guardar = async (datos) => {
    await editarProveedor(token, empresa._id, datos)
    recargar()
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-28 pb-20">
      <Volver />

      <CabeceraOscura etiqueta="Datos de la empresa" titulo={empresa?.nombre_empresa ?? 'Tu empresa'}>
        <p className="mt-2 text-crema/80">Así te ven los bares cuando consultan tu catálogo y te envían pedidos.</p>
      </CabeceraOscura>

      {cargando && <p className="mt-12 text-center text-cafe-suave">Cargando los datos…</p>}

      {error && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </p>
      )}

      {!cargando && !error && empresa && <FormularioProveedor key={empresa._id} inicial={empresa} onEnviar={guardar} propio />}
    </section>
  )
}
