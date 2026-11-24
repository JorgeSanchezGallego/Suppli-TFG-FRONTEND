import { useAuth } from '../../context/useAuth.js'
import { listaConY } from '../../utils/formato.js'

export default function OtrosEncargados({ bar }) {
  const { usuario } = useAuth()
  const otros = (bar.encargados ?? [])
    .filter((e) => typeof e === 'object' && e._id !== usuario._id)
    .map((e) => e.nombre)

  if (otros.length === 0) return null

  return <p className="text-sm text-cafe-suave">También lo gestiona {listaConY(otros)}</p>
}
