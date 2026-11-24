import fotoCabecera from '../assets/img/hero.jpg'

export default function CabeceraOscura({ etiqueta, titulo, foto, children }) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] bg-cafe px-6 py-10 shadow-[0_30px_70px_-20px_rgb(43_33_27/0.55)] sm:px-10 md:px-14 md:py-12">
      <img
        src={foto || fotoCabecera}
        alt=""
        className={`absolute inset-0 size-full object-cover ${foto ? 'opacity-60' : 'opacity-35'}`}
      />
      <div className="absolute inset-0 bg-linear-to-r from-cafe via-cafe/85 to-terracota/50" />
      <div className="relative">
        <p className="text-sm font-medium tracking-[0.25em] text-crema/70 uppercase">{etiqueta}</p>
        <h1 className="mt-2 text-4xl font-semibold text-crema md:text-5xl">{titulo}</h1>
        {children}
      </div>
    </header>
  )
}
