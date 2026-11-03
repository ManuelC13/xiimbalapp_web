import { Award, MapPin } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '@/config/site'

// Pantalla de relleno (maqueta) que se muestra mientras no exista la captura real de la app
function PlaceholderScreen() {
  return (
    <div className="h-full bg-amber-50 p-5 pt-8">
      <p className="text-xl font-extrabold">Hola, [Nombre]</p>
      <p className="mt-5 text-sm text-amber-800">Mis estadísticas</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="h-24 rounded-2xl bg-amber-500" />
        <div className="h-24 rounded-2xl bg-amber-700" />
        <div className="h-24 rounded-2xl bg-amber-900" />
      </div>
      <p className="mt-5 text-sm text-amber-800">Explora por Pueblo Mágico</p>
      <div className="mt-3 flex h-40 items-end rounded-2xl bg-linear-to-br from-amber-200 to-amber-500 p-3">
        <span className="text-sm font-bold">Valladolid</span>
      </div>
      <p className="mt-5 text-sm text-amber-800">Retos activos</p>
      <div className="mt-3 space-y-3">
        <div className="h-14 rounded-2xl border-2 border-amber-500 bg-white" />
        <div className="h-14 rounded-2xl border-2 border-amber-500 bg-white" />
      </div>
    </div>
  )
}

const PHONE_WIDTH =
  'lg:[--phone-w:clamp(190px,calc((100svh_-_280px)*0.4737_+_24px),320px)] ' +
  'lg:short:[--phone-w:clamp(190px,calc((100svh_-_224px)*0.4737_+_24px),320px)]'

// Teléfono con la captura de la app
export default function PhoneMockup({ className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`relative flex items-center justify-center ${PHONE_WIDTH} ${className}`}>
      {/* Círculo decorativo detrás del teléfono con el color original */}
      <div
        className="absolute size-90 animate-circle-pulse rounded-full bg-amber-100/60 will-change-transform motion-reduce:animate-none sm:size-115 lg:size-[calc(var(--phone-w)*1.75)]"
        aria-hidden
      />

      {/* Tarjeta flotante superior izquierda */}
      <div
        className="pointer-events-none absolute -left-2 top-12 z-20 hidden animate-float-slow items-center gap-3 rounded-2xl border border-amber-900/10 bg-amber-50/95 px-4 py-3 shadow-xl shadow-amber-950/15 backdrop-blur-md motion-reduce:animate-none sm:flex lg:-left-6"
        aria-hidden
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-amber-950">
          <MapPin className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-bold text-amber-800">Ruta activa</p>
          <p className="text-sm font-extrabold text-amber-950">7 Pueblos Mágicos</p>
        </div>
      </div>

      {/* Tarjeta flotante inferior derecha */}
      <div
        className="pointer-events-none absolute -right-2 bottom-14 z-20 hidden animate-float-delayed items-center gap-3 rounded-2xl border border-amber-900/10 bg-amber-50/95 px-4 py-3 shadow-xl shadow-amber-950/15 backdrop-blur-md motion-reduce:animate-none sm:flex lg:-right-6"
        aria-hidden
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-amber-950 text-amber-400">
          <Award className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-bold text-amber-800">Explora y gana</p>
          <p className="text-sm font-extrabold text-amber-950">Retos e insignias</p>
        </div>
      </div>

      <div className="relative z-10 w-62.5 animate-phone-float rounded-[2.75rem] border-12 border-amber-950 bg-amber-950 shadow-2xl shadow-amber-950/30 will-change-transform motion-reduce:animate-none sm:w-72.5 lg:w-(--phone-w)">
        <div className="aspect-9/19 overflow-hidden rounded-4xl bg-amber-50">
          {imageFailed ? (
            <PlaceholderScreen />
          ) : (
            <img
              src={SITE.appScreenshot}
              alt="Pantalla de inicio de XíimbalApp"
              className="size-full object-cover object-top"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
