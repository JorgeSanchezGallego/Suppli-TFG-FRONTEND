import { useEffect, useRef, useState } from 'react'

export default function ConfirmarBorrado({ bar, numPedidos, numEmpleados, onCancelar, onConfirmar }) {
  const [texto, setTexto] = useState('')
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')
  const entrada = useRef(null)
  const coincide = texto.trim() === bar.nombre

  useEffect(() => {
    entrada.current?.focus()
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', alPulsarTecla)
    return () => document.removeEventListener('keydown', alPulsarTecla)
  }, [onCancelar])

  const confirmar = async (e) => {
    e.preventDefault()
    if (!coincide) return
    setBorrando(true)
    try {
      await onConfirmar()
    } catch (err) {
      setError(err.message)
      setBorrando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cafe/50 p-4 backdrop-blur-sm" onClick={onCancelar}>
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="borrar-titulo"
        aria-describedby="borrar-texto"
        onSubmit={confirmar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-crema p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.6)] sm:p-8"
      >
        <h2 id="borrar-titulo" className="text-2xl font-semibold">
          Borrar {bar.nombre}
        </h2>
        <div id="borrar-texto" className="mt-3 space-y-2 leading-relaxed text-cafe-suave">
          <p>Esta acción no se puede deshacer. Al borrar el local:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Se borran también sus <strong className="text-cafe">{numPedidos} pedidos</strong> del historial.
            </li>
            <li>
              Sus <strong className="text-cafe">{numEmpleados} empleados</strong> dejan de pertenecer a él.
            </li>
          </ul>
        </div>

        <label htmlFor="confirmar-nombre" className="mt-5 block text-sm font-medium">
          Escribe <strong>{bar.nombre}</strong> para confirmar
        </label>
        <input
          id="confirmar-nombre"
          ref={entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
          className="mt-1.5 w-full rounded-xl border border-arena bg-white px-4 py-3 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
        />

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={!coincide || borrando}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {borrando ? 'Borrando…' : 'Borrar local'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 rounded-full border border-cafe/20 px-5 py-3 font-medium text-cafe transition hover:bg-arena/40"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
