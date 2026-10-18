import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '@/config/site'

export default function Logo({ className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

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
        <span className="text-amber-950">Xíimbal</span>
        <span className="text-amber-800">App</span>
      </span>
    </span>
  )
}