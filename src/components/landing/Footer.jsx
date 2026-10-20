import { Mail } from 'lucide-react'
import BrandIcon from '@/components/ui/BrandIcon'
import Logo from '@/components/landing/Logo'
import { SITE } from '@/config/site'

const linkClass = 'text-lg text-amber-100/70 transition-colors hover:text-amber-500'

export default function Footer() {
  const socialLinks = SITE.social.filter((item) => item.href)

  return (
    <footer className="bg-amber-950 text-amber-100">
      <div className="mx-auto max-w-8xl px-6 lg:px-20">
        <div className="flex flex-col gap-12 py-12 md:flex-row md:justify-between">
          <a href="#inicio" aria-label={`${SITE.name}, ir al inicio`} className="self-start">
            <Logo tone="light" />
          </a>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-20">
            <nav aria-label="Explora">
              <h2 className="text-lg font-bold text-white">Explora</h2>
              <ul className="mt-4 space-y-3">
                {SITE.nav.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-lg font-bold text-white">Contacto</h2>
              <ul className="mt-4 space-y-3">
                {SITE.contactEmail && (
                  <li>
                    <a href={`mailto:${SITE.contactEmail}`} className={`${linkClass} inline-flex items-center gap-2`}>
                      <Mail className="size-5 shrink-0" aria-hidden />
                      <span className="wrap-break">{SITE.contactEmail}</span>
                    </a>
                  </li>
                )}
                {socialLinks.length > 0 && (
                  <li className="flex gap-3 pt-1">
                    {socialLinks.map((item) => {
                      const external = /^https?:\/\//.test(item.href)
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          aria-label={item.label}
                          title={item.label}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="flex size-11 items-center justify-center rounded-full bg-white/10 text-amber-100/80 transition-colors hover:bg-amber-500 hover:text-amber-950"
                        >
                          <BrandIcon name={item.name} className="size-5" />
                        </a>
                      )
                    })}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/20 py-6 text-sm text-amber-50/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <a href={SITE.adminUrl} className="transition-colors hover:text-gray-100">
            Acceso equipo
          </a>
        </div>
      </div>
    </footer>
  )
}