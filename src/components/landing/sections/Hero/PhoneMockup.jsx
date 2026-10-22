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
      {/* Círculo decorativo detrás del teléfono */}
      <div
        className="absolute size-90 animate-circle-pulse rounded-full bg-amber-100/60 will-change-transform motion-reduce:animate-none sm:size-115 lg:size-[calc(var(--phone-w)*1.75)]"
        aria-hidden
      />

      <div className="relative w-62.5 animate-phone-float rounded-[2.75rem] border-12 border-amber-950 bg-amber-950 shadow-2xl shadow-amber-950/30 will-change-transform motion-reduce:animate-none sm:w-72.5 lg:w-(--phone-w)">
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