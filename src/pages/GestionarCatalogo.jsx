import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useCatalogoDeProveedor } from '../hooks/useCatalogoDeProveedor.js'
import { borrarProveedor, editarProveedor } from '../api/proveedores.js'
import { GestionCatalogo } from './MiCatalogo.jsx'
import FormularioProveedor from '../components/proveedor/FormularioProveedor.jsx'
import ConfirmarBorradoProveedor from '../components/proveedor/ConfirmarBorradoProveedor.jsx'

export default function GestionarCatalogo() {
  const { proveedorId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const datos = useCatalogoDeProveedor(proveedorId)
  const { empresa, productos, cargando, error, recargar } = datos
  const [borrando, setBorrando] = useState(false)
  const cancelar = useCallback(() => setBorrando(false), [])

  const guardar = async (cambios) => {
    await editarProveedor(token, proveedorId, cambios)
    recargar()
  }

  return (
    <GestionCatalogo key={proveedorId} {...datos} propio={false}>
      {!cargando && !error && empresa && (
        <>
          <div className="mt-12">
            <h2 className="text-sm font-medium tracking-[0.25em] text-terracota uppercase">Datos del proveedor</h2>
            <FormularioProveedor key={empresa._id} inicial={empresa} onEnviar={guardar} className="mt-4" />
          </div>

          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50/50 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-red-700">Borrar proveedor</h2>
            <p className="mt-1 text-sm text-cafe-suave">
              Se borrarán también sus productos y todos sus pedidos, en todos los bares. No se puede deshacer.
            </p>
            <button
              type="button"
              onClick={() => setBorrando(true)}
              className="mt-4 rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Borrar {empresa.nombre_empresa}
            </button>
          </div>

          {borrando && (
            <ConfirmarBorradoProveedor
              proveedor={empresa}
              numProductos={productos.length}
              onCancelar={cancelar}
              onConfirmar={async () => {
                await borrarProveedor(token, proveedorId)
                navigate('/catalogo', { replace: true })
              }}
            />
          )}
        </>
      )}
    </GestionCatalogo>
  )
}
