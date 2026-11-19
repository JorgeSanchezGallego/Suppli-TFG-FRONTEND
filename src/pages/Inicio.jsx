import Hero from '../components/Hero.jsx'
import TarjetaLocal from '../components/TarjetaLocal.jsx'
import locales from '../data/locales.js'

export default function Inicio() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-14 text-center md:mb-20">
          <p className="text-sm font-medium tracking-[0.25em] text-terracota uppercase">Alicante</p>
          <h2 className="mt-2 text-4xl font-semibold md:text-5xl">Nuestros locales</h2>
        </div>

        <div className="space-y-10 md:space-y-14">
          {locales.map((local, i) => (
            <TarjetaLocal key={local.id} local={local} invertida={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  )
}
