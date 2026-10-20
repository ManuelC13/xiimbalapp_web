import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '@/config/site'

// Logo: imagen + nombre. Si la imagen no existe, muestra un ícono de respaldo.
// tone = "light" es para fondos oscuros (footer por ejemplo).
export default function Logo({ tone = 'dark', className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const light = tone === 'light'

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {imageFailed ? (
        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500 text-white">
          <MapPin className="size-6" aria-hidden />
        </span>
      ) : (
        <img
          src={SITE.logo}
          alt=""
          className="size-11 object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        <span className={light ? 'text-amber-50' : 'text-amber-950'}>Xíimbal</span>
        <span className={light ? 'text-amber-50' : 'text-amber-800'}>App</span>
      </span>
    </span>
  )
}