import { useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import { cambiarRol } from '../../api/usuarios.js'

const ROLES = {
  empleado: { texto: 'Empleado', aviso: 'Podrá hacer pedidos en los locales a los que lo añadas.' },
  encargado: {
    texto: 'Encargado',
    aviso: 'Podrá crear locales y gestionar los que compartáis. Dejará de trabajar como empleado en sus locales actuales.',
  },
  proveedor: {
    texto: 'Proveedor',
    aviso: 'Solo verá el catálogo y los pedidos de su empresa. Dejará de pertenecer a sus locales.',
  },
}

const AVISO_DEJA_ENCARGADO =
  'Dejará de gestionar los locales que comparte. Si es el único encargado de alguno, no se podrá cambiar hasta que añadas a otro encargado.'

export default function CambiarRol({ usuario: persona, proveedores, onCambiado }) {
  const { token } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [role, setRole] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const opciones = Object.keys(ROLES).filter((r) => r !== persona.role)
  const falta = !role || (role === 'proveedor' && !proveedor)

  const cerrar = () => {
    setAbierto(false)
    setRole('')
    setProveedor('')
    setError('')
  }

  const guardar = async () => {
    setGuardando(true)
    setError('')
    try {
      await cambiarRol(token, persona._id, { role, proveedor: role === 'proveedor' ? proveedor : undefined })
      cerrar()
      onCambiado()
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="text-sm font-medium text-terracota hover:text-terracota-oscuro"
      >
        Cambiar rol
      </button>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl bg-arena/40 p-4">
      <p className="text-sm font-medium">Cambiar el rol de {persona.nombre}</p>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Nuevo rol">
        {opciones.map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              role === r ? 'bg-terracota text-crema' : 'bg-white text-cafe ring-1 ring-arena hover:ring-terracota/50'
            }`}
          >
            {ROLES[r].texto}
          </button>
        ))}
      </div>

      {role === 'proveedor' && (
        <div>
          <label htmlFor={`empresa-${persona._id}`} className="text-xs font-medium text-cafe-suave">
            Empresa proveedora
          </label>
          <select
            id={`empresa-${persona._id}`}
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            className="mt-1 w-full rounded-full border border-arena bg-white px-3 py-2 text-sm text-cafe outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/15"
          >
            <option value="">Elige la empresa</option>
            {proveedores.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre_empresa}
              </option>
            ))}
          </select>
        </div>
      )}

      {role && (
        <p className="text-xs leading-relaxed text-cafe-suave">
          {persona.role === 'encargado' ? AVISO_DEJA_ENCARGADO : ROLES[role].aviso}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={guardar}
          disabled={falta || guardando}
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-crema hover:bg-terracota-oscuro disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : role ? `Cambiar a ${ROLES[role].texto.toLowerCase()}` : 'Cambiar'}
        </button>
        <button type="button" onClick={cerrar} className="rounded-full px-4 py-2 text-sm font-medium text-cafe-suave hover:bg-arena/60">
          Cancelar
        </button>
      </div>
    </div>
  )
}
