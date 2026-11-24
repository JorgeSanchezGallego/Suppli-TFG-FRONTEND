const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export async function peticion(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const esFormulario = cuerpo instanceof FormData
  const cabeceras = {}
  if (cuerpo && !esFormulario) cabeceras['Content-Type'] = 'application/json'
  if (token) cabeceras.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo ? (esFormulario ? cuerpo : JSON.stringify(cuerpo)) : undefined,
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor. Inténtalo de nuevo en unos minutos.')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const mensaje = typeof datos === 'string' ? datos : datos?.error
    const error = new Error(mensaje || 'Ha ocurrido un error inesperado.')
    error.estado = respuesta.status
    throw error
  }

  return datos
}
