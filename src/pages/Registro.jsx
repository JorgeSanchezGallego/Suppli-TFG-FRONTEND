import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import PantallaAcceso from '../components/formulario/PantallaAcceso.jsx'
import Campo from '../components/formulario/Campo.jsx'
import CampoContrasena from '../components/formulario/CampoContrasena.jsx'
import * as validar from '../utils/validaciones.js'
import fotoRegistro from '../assets/img/registro.avif'

const vacio = {
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  fechaNacimiento: '',
  residencia: '',
  contraseña: '',
  repetir: '',
}

const ancho = 'sm:col-span-2 md:col-span-1 lg:col-span-2'

function comprobar(datos) {
  return {
    nombre: validar.obligatorio(datos.nombre, 'Escribe tu nombre.'),
    apellidos: validar.obligatorio(datos.apellidos, 'Escribe tus apellidos.'),
    correo: validar.correo(datos.correo),
    telefono: validar.telefono(datos.telefono),
    fechaNacimiento: validar.fechaNacimiento(datos.fechaNacimiento),
    residencia: validar.obligatorio(datos.residencia, 'Indica dónde vives.'),
    contraseña: validar.contraseñaNueva(datos.contraseña),
    repetir: validar.repetirContraseña(datos.repetir, datos.contraseña),
  }
}

export default function Registro() {
  const { usuario, registrarse } = useAuth()
  const navigate = useNavigate()

  const [datos, setDatos] = useState(vacio)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario && !enviando) return <Navigate to="/panel" replace />

  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
    setErrorServidor('')
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevosErrores = comprobar(datos)
    setErrores(nuevosErrores)
    if (!validar.sinErrores(nuevosErrores)) return

    setEnviando(true)
    try {
      await registrarse({
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim(),
        telefono: validar.limpiarTelefono(datos.telefono),
        fechaNacimiento: datos.fechaNacimiento,
        residencia: datos.residencia.trim(),
        contraseña: datos.contraseña,
      })
      navigate('/panel', { replace: true })
    } catch (error) {
      setErrorServidor(error.message)
      setEnviando(false)
    }
  }

  const campo = (id) => ({ id, value: datos[id], onChange: cambiar, error: errores[id] })

  return (
    <PantallaAcceso foto={fotoRegistro} frase="Únete a tu equipo y empieza a hacer pedidos en minutos." ancha>
      <h1 className="text-3xl font-semibold sm:text-4xl">Crea tu cuenta</h1>
      <p className="mt-2 text-cafe-suave">Solo te llevará un minuto.</p>

      <form onSubmit={enviar} noValidate className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <Campo {...campo('nombre')} etiqueta="Nombre" autoComplete="given-name" placeholder="Ana" />
        <Campo {...campo('apellidos')} etiqueta="Apellidos" autoComplete="family-name" placeholder="García Pérez" />

        <Campo
          {...campo('correo')}
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          className={ancho}
        />

        <Campo
          {...campo('telefono')}
          etiqueta="Teléfono"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="600 123 456"
        />
        <Campo {...campo('fechaNacimiento')} etiqueta="Fecha de nacimiento" type="date" autoComplete="bday" />

        <Campo
          {...campo('residencia')}
          etiqueta="Residencia"
          autoComplete="address-level2"
          placeholder="Alicante"
          className={ancho}
        />

        <CampoContrasena {...campo('contraseña')} etiqueta="Contraseña" autoComplete="new-password" />
        <CampoContrasena {...campo('repetir')} etiqueta="Repite la contraseña" autoComplete="new-password" />

        <p className={`-mt-2 text-xs text-cafe-suave ${ancho}`}>
          Mínimo 8 caracteres, con al menos una mayúscula y un número.
        </p>

        {errorServidor && (
          <p role="alert" className={`rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ${ancho}`}>
            {errorServidor}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className={`rounded-full bg-terracota py-3 font-medium text-crema transition-colors hover:bg-terracota-oscuro disabled:cursor-wait disabled:opacity-70 ${ancho}`}
        >
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-8 text-center text-cafe-suave">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-terracota hover:text-terracota-oscuro">
          Inicia sesión
        </Link>
      </p>
    </PantallaAcceso>
  )
}
