export default function FilaEmpleado({ empleado, barActual, accion }) {
  const nombre = [empleado.nombre, empleado.apellidos].filter(Boolean).join(' ')
  const otrosLocales = (empleado.bares ?? []).filter((b) => typeof b === 'object' && b._id !== barActual)

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-terracota/10 font-semibold text-terracota"
      >
        {empleado.nombre?.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{nombre}</p>
        <p className="truncate text-sm text-cafe-suave">{empleado.correo}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {(empleado.bares ?? []).length === 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Sin local</span>
          )}
          {otrosLocales.map((b) => (
            <span key={b._id} className="rounded-full bg-arena/60 px-2.5 py-0.5 text-xs font-medium text-cafe-suave">
              {b.nombre}
            </span>
          ))}
        </div>
      </div>
      {accion}
    </li>
  )
}
