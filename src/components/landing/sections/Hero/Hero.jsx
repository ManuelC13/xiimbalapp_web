import Button from '@/components/ui/Button'
import { SITE } from '@/config/site'
import PhoneMockup from './PhoneMockup'

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden">
      {/* Fondo original: degradado diagonal ámbar + desvanecido a crema en la parte inferior */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-amber-600 via-amber-500 to-amber-200" aria-hidden />

      {/* Sendero decorativo sutil en segundo plano */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 size-full text-amber-950/8"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M-80 680 C 260 520, 420 790, 740 540 C 1020 320, 1210 480, 1520 260"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="10 14"
          strokeLinecap="round"
        />
        <circle cx="310" cy="635" r="6" fill="currentColor" />
        <circle cx="740" cy="540" r="8" fill="currentColor" />
        <circle cx="1140" cy="405" r="6" fill="currentColor" />
      </svg>

      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-b from-amber-50/0 via-amber-50/70 to-amber-50"
        aria-hidden
      />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-20 pt-32 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:px-10 lg:short:pb-10 lg:short:pt-28">
        <div className="max-w-2xl lg:pl-10">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:short:text-5xl">
            Explora los <span className="text-amber-800">Pueblos Mágicos</span> de Yucatán
          </h1>
          <p className="mt-8 max-w-lg text-xl leading-relaxed text-amber-950/90">
            Descubre lugares, completa retos, obtén recompensas y recorre el estado con un mapa en tu bolsillo.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={SITE.downloadUrl}>
              Descargar la app
            </Button>
            <Button href="#que-es" variant="outline">
              Conocer más
            </Button>
          </div>
        </div>

        <PhoneMockup className="py-6" />
      </div>
    </section>
  )
}
