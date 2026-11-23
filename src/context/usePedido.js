import { useContext } from 'react'
import { PedidoContext } from './PedidoContext.js'

export function usePedido() {
  const contexto = useContext(PedidoContext)
  if (!contexto) throw new Error('usePedido debe usarse dentro de <PedidoProvider>')
  return contexto
}
