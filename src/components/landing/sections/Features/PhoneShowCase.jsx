import { useState } from 'react'
import { PREVIEWS } from './FeaturesPreview'

// Muestra la captura `image` y si no existe todavía entonces se muestra la maqueta `preview`.
export default function PhoneShowcase({ image, imageAlt, gradient, preview }) {
  const [imageFailed, setImageFailed] = useState(false)
  const Preview = PREVIEWS[preview]

  return (
    <div
      className={`relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-amber-950/20 ${gradient}`}
    >
      <div className="absolute left-1/2 top-[4%] w-[52%] -translate-x-1/2 rounded-t-[2.5rem] border-10 border-b-0 border-amber-950 bg-amber-50 sm:border-12">
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