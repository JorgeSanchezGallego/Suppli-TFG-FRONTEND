export default function PantallaAcceso({ foto, frase, ancha = false, children }) {
  return (
    <section className="relative min-h-svh overflow-hidden">
      <img src={foto} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-cafe/45 md:bg-transparent md:bg-linear-to-r md:from-cafe/80 md:via-cafe/45 md:to-cafe/20" />

      <div
        className={`relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-4 pt-28 pb-16 md:grid-cols-2 md:px-8 ${
          ancha ? 'lg:grid-cols-[2fr_3fr]' : ''
        }`}
      >
        <div className="hidden md:block">
          <p className="text-sm font-medium tracking-[0.25em] text-crema/80 uppercase">Gestor de pedidos</p>
          <p className="mt-3 max-w-md text-3xl leading-snug font-semibold text-crema lg:text-5xl lg:leading-tight">
            {frase}
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div
            className={`w-full rounded-3xl bg-crema/95 p-6 shadow-[0_24px_60px_-15px_rgb(43_33_27/0.5)] backdrop-blur sm:p-8 md:p-10 lg:p-12 ${
              ancha ? 'max-w-sm sm:max-w-xl md:max-w-md lg:max-w-2xl' : 'max-w-sm md:max-w-md'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
