export const ESTADOS = {
  pendiente: { texto: 'Pendiente', clases: 'bg-amber-100 text-amber-800' },
  entregado: { texto: 'Entregado', clases: 'bg-emerald-100 text-emerald-800' },
}

const PUEDEN_MARCAR_ENTREGADO = ['encargado', 'empleado']

export function siguienteEstado(pedido, role) {
  if (pedido.estado !== 'pendiente' || !PUEDEN_MARCAR_ENTREGADO.includes(role)) return null
  return 'entregado'
}
