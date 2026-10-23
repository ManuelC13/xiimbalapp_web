import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Logo from '@/components/landing/Logo'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { isAdmin, useAuthStore } from '@/store/authStore'

const FIELD =
  'h-12 w-full rounded-full border border-gris-100 bg-white pl-12 pr-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

function Field({ id, label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="ml-4 text-sm font-semibold">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" aria-hidden />
        <input id={id} required className={FIELD} {...props} />
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, ready, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (ready && user) return <Navigate to={isAdmin(user) ? '/admin' : '/'} replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loggedUser = await login(email.trim(), password)
      navigate(isAdmin(loggedUser) ? '/admin' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6 py-10">
      <Reveal className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gris-100 bg-white p-8 shadow-sm sm:p-10"
        >
          <Link to="/" aria-label="Ir al inicio" className="flex justify-center">
            <Logo variant="scrolled" />
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">Iniciar sesión</h1>
            <p className="mt-2 text-gris-700">Accede con tu cuenta de XíimbalApp</p>
          </div>

          <Field id="email" label="Correo" placeholder="correo@dominio.com" icon={Mail} required type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field id="password" label="Contraseña" placeholder="********" icon={Lock} required type="password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && (
            <p role="alert" className="rounded-2xl border border-border-error bg-background-error px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full disabled:opacity-60">
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>

          <Link to="/" className="block text-center text-sm font-semibold text-amber-800 hover:text-amber-950">
            ← Volver al inicio
          </Link>
        </form>
      </Reveal>
    </main>
  )
}
