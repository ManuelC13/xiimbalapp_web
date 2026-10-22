import { siAndroid, siFacebook, siInstagram, siTiktok } from 'simple-icons'

const ICONS = {
  android: siAndroid,
  facebook: siFacebook,
  instagram: siInstagram,
  tiktok: siTiktok,
}

export default function BrandIcon({ name, className = 'size-6' }) {
  const icon = ICONS[name]
  if (!icon) return null

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}