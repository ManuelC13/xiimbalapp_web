import { LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import Logo from '@/components/landing/Logo'

export default function AdminNavbar({ user, onLogout }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-amber-50/95 shadow-md shadow-amber-950/5 backdrop-blur">
      <nav className="mx-auto flex h-25 max-w-8xl items-center justify-between px-6 lg:px-15" aria-label="Administración">
        <Logo variant="scrolled" />

        <div className="flex items-center gap-6 lg:gap-10">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-lg font-semibold text-amber-950">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gris-700">{user.role_name}</p>
          </div>
          <Button title="cerrar sesión" size="sm" onClick={onLogout}>
            <LogOut className="size-4" aria-hidden />
          </Button>
        </div>
      </nav>
    </header>
  )
}
