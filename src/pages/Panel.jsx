import { useAuth } from '../context/useAuth.js'

const roles = {
  empleado: 'Empleado',
  encargado: 'Encargado',
  proveedor: 'Proveedor',
}

export default function Panel() {
  const { usuario } = useAuth()

  return (
    <section className="mx-auto max-w-5xl px-4 pt-32 pb-20">
      <span className="inline-block rounded-full bg-terracota/10 px-3 py-1 text-sm font-medium text-terracota">
        {roles[usuario.role] ?? usuario.role}
      </span>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Hola, {usuario.nombre}</h1>
      <p className="mt-3 text-lg text-cafe-suave">Muy pronto tendrás aquí el catálogo y tus pedidos.</p>
    </section>
  )
}
