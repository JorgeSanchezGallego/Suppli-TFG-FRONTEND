export function localesParaPedir(usuario) {
  if (!usuario) return []
  const lista =
    usuario.role === 'encargado' ? usuario.baresGestionados : usuario.role === 'empleado' ? usuario.bares : []
  return (lista ?? []).filter((bar) => typeof bar === 'object')
}
