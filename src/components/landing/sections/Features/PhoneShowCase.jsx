import { useState } from 'react'
import { PREVIEWS } from './FeaturesPreview'

// Muestra la captura `image` y si no existe todavía entonces se muestra la maqueta `preview`.
export default function PhoneShowcase({ image, imageAlt, gradient, preview, reverse = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const Preview = PREVIEWS[preview]
  const floatDelay = { animationDelay: reverse ? '-2.5s' : '0s' }

  return (
    <div
      className={`relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-amber-950/20 ${gradient}`}
    >
      {/* Destellos detrás del teléfono */}
      <div
        className="absolute left-[-8%] top-[8%] size-[45%] animate-blob-drift rounded-full bg-white/25 blur-3xl motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="absolute right-[-6%] bottom-[2%] size-[40%] animate-blob-drift-reverse rounded-full bg-amber-100/30 blur-3xl motion-reduce:animate-none"
        aria-hidden
      />

      <div
        style={floatDelay}
        className="absolute left-1/2 top-[4%] w-[52%] -translate-x-1/2 animate-showcase-float rounded-t-[2.5rem] border-10 border-b-0 border-amber-950 bg-amber-50 will-change-transform motion-reduce:animate-none sm:border-12"
      >
        <div className="aspect-9/19 overflow-hidden rounded-t-[1.75rem]">
          {imageFailed && Preview ? (
            <Preview />
          ) : (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="block w-full"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}