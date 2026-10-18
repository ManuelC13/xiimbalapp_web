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

// Teléfono con la captura de la app
export default function PhoneMockup({ className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Círculo decorativo detrás del teléfono */}
      <div
        className="absolute size-90 rounded-full bg-amber-100/60 sm:size-115 lg:size-140"
        aria-hidden
      />

      <div className="relative w-62.5 rounded-[2.75rem] border-12 border-amber-950 bg-amber-950 shadow-2xl shadow-amber-950/30 sm:w-72.5 lg:w-[320px]">
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