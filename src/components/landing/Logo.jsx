import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '@/config/site'

// Logo: imagen + nombre
export default function Logo({ variant = 'hero', className = '' }) {
  const [failed, setFailed] = useState({})
  const light = variant === 'footer'

  const keys = variant === 'footer' ? ['footer'] : ['hero', 'scrolled']
  const usable = keys.filter((key) => SITE.logos[key] && !failed[key])
  const shown = usable.includes(variant) ? variant : usable[0]

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {shown ? (
        <span className="relative size-11 shrink-0">
          {usable.map((key) => (
            <img
              key={key}
              src={SITE.logos[key]}
              alt=""
              className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${
                key === shown ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => setFailed((current) => ({ ...current, [key]: true }))}
            />
          ))}
        </span>
      ) : (
        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500 text-white">
          <MapPin className="size-6" aria-hidden />
        </span>
      )}
      <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        <span className={light ? 'text-amber-50' : 'text-amber-950'}>Xíimbal</span>
        <span className={light ? 'text-amber-50' : 'text-amber-800'}>App</span>
      </span>
    </span>
  )
}