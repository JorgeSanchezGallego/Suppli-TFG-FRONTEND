import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import { crearProducto, editarProducto } from '../../api/productos.js'
import Campo from '../formulario/Campo.jsx'
import SelectorFoto from '../encargado/SelectorFoto.jsx'
import { botonPrimario } from '../estilos.js'
import { obligatorio, sinErrores, validarFoto } from '../../utils/validaciones.js'

const MEDIDAS = ['botella', 'lata', 'barril', 'caja', 'kg', 'bolsa 1kg', 'ud']

const textoNumero = (valor) => (valor === undefined || valor === null ? '' : String(valor).replace('.', ','))
const aNumero = (texto) => Number(String(texto).trim().replace(',', '.'))

function validarPrecio(texto) {
  if (!String(texto).trim()) return 'Indica el precio.'
  const valor = aNumero(texto)
  if (!Number.isFinite(valor) || valor <= 0) return 'Escribe un precio mayor que 0, por ejemplo 1,25.'
}

function validarStock(texto) {
  if (!String(texto).trim()) return 'Indica una cantidad.'
  const valor = aNumero(texto)
  if (!Number.isInteger(valor) || valor < 0) return 'Tiene que ser un número entero, 0 o más.'
}

export default function FormularioProducto({ producto, proveedorId, categorias, onCerrar, onGuardado }) {
  const { token } = useAuth()
  const editando = Boolean(producto)
  const [datos, setDatos] = useState({
    nombre: producto?.nombre ?? '',
    precio: producto ? producto.precio.toFixed(2).replace('.', ',') : '',
    medida: producto?.medida ?? '',
    categoria: producto?.categoria ?? '',
    stock_optimo_invierno: textoNumero(producto?.stock_optimo_invierno),
    stock_optimo_verano: textoNumero(producto?.stock_optimo_verano),
  })
  const [foto, setFoto] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsarTecla)
    return () => document.removeEventListener('keydown', alPulsarTecla)
  }, [onCerrar])

  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevos = {
      nombre: obligatorio(datos.nombre, 'Escribe el nombre del producto.'),
      precio: validarPrecio(datos.precio),
      medida: obligatorio(datos.medida, 'Indica cómo se vende: botella, kg, caja…'),
      categoria: obligatorio(datos.categoria, 'Indica la categoría.'),
      stock_optimo_invierno: validarStock(datos.stock_optimo_invierno),
      stock_optimo_verano: validarStock(datos.stock_optimo_verano),
      foto: (!editando && !foto ? 'Sube una foto del producto.' : validarFoto(foto)) || undefined,
    }
    setErrores(nuevos)
    if (!sinErrores(nuevos)) return

    const campos = {
      nombre: datos.nombre.trim(),
      precio: aNumero(datos.precio),
      medida: datos.medida.trim().toLowerCase(),
      categoria: datos.categoria.trim().toLowerCase(),
      stock_optimo_invierno: aNumero(datos.stock_optimo_invierno),
      stock_optimo_verano: aNumero(datos.stock_optimo_verano),
      imagen: foto,
    }

    setGuardando(true)
    setErrorServidor('')
    try {
      if (editando) await editarProducto(token, producto._id, campos)
      else await crearProducto(token, { ...campos, proveedor: proveedorId })
      onGuardado()
    } catch (error) {
      setErrorServidor(error.message)
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-cafe/50 p-4 backdrop-blur-sm" onClick={onCerrar}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="producto-titulo"
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        noValidate
        className="my-8 w-full max-w-2xl rounded-3xl bg-crema p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.6)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="producto-titulo" className="text-2xl font-semibold">
            {editando ? `Editar ${producto.nombre}` : 'Nuevo producto'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid size-9 shrink-0 place-items-center rounded-full text-cafe-suave hover:bg-arena/50 hover:text-cafe"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Campo
            id="nombre"
            etiqueta="Nombre"
            placeholder="Refresco de cola 33cl"
            value={datos.nombre}
            onChange={cambiar}
            error={errores.nombre}
            className="sm:col-span-2"
            autoFocus
          />
          <Campo
            id="precio"
            etiqueta="Precio (€)"
            placeholder="0,65"
            inputMode="decimal"
            value={datos.precio}
            onChange={cambiar}
            error={errores.precio}
          />
          <Campo
            id="medida"
            etiqueta="Se vende por"
            placeholder="botella"
            list="medidas-producto"
            value={datos.medida}
            onChange={cambiar}
            error={errores.medida}
          />
          <datalist id="medidas-producto">
            {MEDIDAS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <Campo
            id="categoria"
            etiqueta="Categoría"
            placeholder="refrescos"
            list="categorias-producto"
            value={datos.categoria}
            onChange={cambiar}
            error={errores.categoria}
            className="sm:col-span-2"
          />
          <datalist id="categorias-producto">
            {categorias.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Campo
            id="stock_optimo_invierno"
            etiqueta="Stock recomendado en invierno"
            placeholder="24"
            inputMode="numeric"
            value={datos.stock_optimo_invierno}
            onChange={cambiar}
            error={errores.stock_optimo_invierno}
          />
          <Campo
            id="stock_optimo_verano"
            etiqueta="Stock recomendado en verano"
            placeholder="48"
            inputMode="numeric"
            value={datos.stock_optimo_verano}
            onChange={cambiar}
            error={errores.stock_optimo_verano}
          />
          <p className="-mt-2 text-xs text-cafe-suave sm:col-span-2">
            Es la cantidad que aconsejas tener en el local en cada temporada. Los bares la ven en la ficha del producto.
          </p>
          <div className="sm:col-span-2">
            <SelectorFoto
              archivo={foto}
              actual={producto?.imagen}
              opcional={false}
              ayuda={editando ? 'Si no eliges otra, se mantiene la foto actual.' : 'Es la foto que verán los bares en el catálogo.'}
              onCambiar={(archivo) => {
                setFoto(archivo)
                setErrores({ ...errores, foto: validarFoto(archivo) || undefined })
              }}
              error={errores.foto}
            />
          </div>
        </div>

        {errorServidor && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorServidor}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row-reverse">
          <button type="submit" disabled={guardando} className={`${botonPrimario} flex-1`}>
            {guardando ? (foto ? 'Subiendo foto…' : 'Guardando…') : editando ? 'Guardar cambios' : 'Añadir producto'}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-full border border-cafe/20 px-5 py-3 font-medium text-cafe transition hover:bg-arena/40"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
