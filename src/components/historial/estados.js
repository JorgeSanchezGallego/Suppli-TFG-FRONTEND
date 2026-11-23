export const ESTADOS = {
  pendiente: { texto: 'Pendiente', clases: 'bg-amber-100 text-amber-800' },
  enviado: { texto: 'Enviado', clases: 'bg-sky-100 text-sky-800' },
  entregado: { texto: 'Entregado', clases: 'bg-emerald-100 text-emerald-800' },
}

const SIGUIENTE = { pendiente: 'enviado', enviado: 'entregado' }

const PUEDEN_MARCAR = {
  enviado: ['proveedor', 'encargado'],
  entregado: ['encargado', 'empleado'],
}

export function siguienteEstado(pedido, role) {
  const siguiente = SIGUIENTE[pedido.estado]
  if (!siguiente || !PUEDEN_MARCAR[siguiente].includes(role)) return null
  return siguiente
}
