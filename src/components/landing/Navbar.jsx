import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Logo from '@/components/landing/Logo'
import { SITE } from '@/config/site'
import useScrolled from '@/hooks/useScrolled'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  // Transparente sobre el hero, con fondo al desplazarse o con el menú móvil abierto
  const solid = scrolled || open

  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-amber-50/95 shadow-md shadow-amber-950/5 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10" aria-label="Principal">
        <a href="#inicio" aria-label={`${SITE.name}, ir al inicio`} onClick={close}>
          <Logo />
        </a>

        {/* Escritorio */}
        <div className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-10">
            {SITE.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-lg font-semibold text-amber-950 transition-colors hover:text-amber-800">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={SITE.downloadUrl} size="sm">Descargar app</Button>
        </div>

        {/* Móvil */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full p-2 text-amber-950 hover:bg-amber-950/10 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-amber-950/10 px-6 pb-6 md:hidden">
          <ul className="space-y-1 py-4">
            {SITE.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="block rounded-2xl px-4 py-3 text-lg font-semibold text-amber-950 hover:bg-amber-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={SITE.downloadUrl} onClick={close} className="w-full">
            Descargar app
          </Button>
        </div>
      )}
    </header>
  )
}