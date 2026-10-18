import Button from '@/components/ui/Button'
import { SITE } from '@/config/site'
import PhoneMockup from './PhoneMockup'

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden">
      {/* Fondo: degradado diagonal ámbar + desvanecido a crema en la parte inferior */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-amber-600 via-amber-500 to-amber-200" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-b from-transparent to-amber-50"
        aria-hidden
      />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-20 pt-32 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:px-10">
        <div className="max-w-2xl lg:pl-10">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Explora los <span className="text-amber-800">Pueblos Mágicos</span> de Yucatán
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-amber-950/90">
            Descubre lugares, completa retos, gana insignias y recorre el estado con un mapa en tu bolsillo.
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