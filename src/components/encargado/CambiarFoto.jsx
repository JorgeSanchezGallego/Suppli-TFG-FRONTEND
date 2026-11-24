import { useId, useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import { cambiarFotoBar } from '../../api/bares.js'
import { FORMATOS_FOTO, validarFoto } from '../../utils/validaciones.js'

export default function CambiarFoto({ bar, onGuardado }) {
  const { token } = useAuth()
  const id = useId()
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  const subir = async (archivo) => {
    if (!archivo) return
    const problema = validarFoto(archivo)
    if (problema) {
      setError(problema)
      return
    }
    setError('')
    setSubiendo(true)
    try {
      await cambiarFotoBar(token, bar._id, archivo)
      onGuardado()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <>
      <label
        htmlFor={id}
        aria-disabled={subiendo}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-crema/10 px-5 py-2.5 text-sm font-medium text-crema ring-1 ring-crema/30 transition hover:bg-crema/20 ${
          subiendo ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {subiendo ? 'Subiendo foto…' : bar.imagen ? 'Cambiar foto' : 'Añadir foto'}
      </label>
      <input
        id={id}
        type="file"
        accept={FORMATOS_FOTO}
        className="sr-only"
        disabled={subiendo}
        onChange={(e) => {
          subir(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {error && <p className="basis-full text-sm text-red-200">{error}</p>}
    </>
  )
}
