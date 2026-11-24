import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { obtenerMisBares } from '../api/bares.js'
import { obtenerUsuarios } from '../api/usuarios.js'
import { obtenerHistorial } from '../api/pedidos.js'

const idDe = (valor) => (typeof valor === 'object' ? valor?._id : valor)

export function useEncargado() {
  const { token } = useAuth()
  const [bares, setBares] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelado = false
    Promise.all([obtenerMisBares(token), obtenerUsuarios(token), obtenerHistorial(token)])
      .then(([listaBares, listaUsuarios, listaPedidos]) => {
        if (cancelado) return
        setBares(listaBares)
        setUsuarios(listaUsuarios)
        setPedidos(listaPedidos)
        setError('')
      })
      .catch((e) => {
        if (!cancelado) setError(e.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [token, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  const empleados = useMemo(() => usuarios.filter((u) => u.role === 'empleado'), [usuarios])

  const datos = useMemo(() => {
    const empleadosPorBar = {}
    const pendientesPorBar = {}
    for (const bar of bares) {
      empleadosPorBar[bar._id] = []
      pendientesPorBar[bar._id] = 0
    }
    for (const empleado of empleados) {
      for (const bar of empleado.bares ?? []) {
        const id = idDe(bar)
        if (empleadosPorBar[id]) empleadosPorBar[id].push(empleado)
      }
    }
    for (const pedido of pedidos) {
      const id = idDe(pedido.bar)
      if (pedido.estado === 'pendiente' && id in pendientesPorBar) pendientesPorBar[id] += 1
    }

    const misEmpleados = empleados.filter((e) => (e.bares ?? []).some((b) => idDe(b) in empleadosPorBar))
    const sinLocal = empleados.filter((e) => (e.bares ?? []).length === 0)
    const pendientes = Object.values(pendientesPorBar).reduce((a, b) => a + b, 0)

    return { empleadosPorBar, pendientesPorBar, misEmpleados, sinLocal, pendientes }
  }, [bares, empleados, pedidos])

  return { bares, usuarios, empleados, pedidos, ...datos, cargando, error, recargar }
}
