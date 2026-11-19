import Logo from './Logo.jsx'
import fotoHero from '../assets/img/hero.jpg'

export default function Hero() {
  return (
    <section className="relative grid h-svh place-items-center overflow-hidden">
      <img src={fotoHero} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-cafe/55" />

      <div className="relative flex flex-col items-center gap-4 px-4 text-center">
        <h1>
          <Logo tamano="lg" claro />
        </h1>
        <p className="text-xl font-light tracking-[0.3em] text-crema/90 uppercase md:text-2xl">
          Gestor de pedidos
        </p>
      </div>
    </section>
  )
}
