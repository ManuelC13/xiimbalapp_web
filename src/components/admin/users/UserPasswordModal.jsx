import { useState } from 'react'
import { X, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function UserPasswordModal({
  user,
  loading = false,
  onClose,
  onSave,
}) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  // Validaciones
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isStrong = hasMinLength && hasUpper && hasLower && hasNumber

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!isStrong) {
      setError('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y un número.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    onSave(password)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-900 text-amber-100">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-amber-950">Restablecer Contraseña</h3>
              <p className="text-xs text-gris-600">Para {user.first_name} {user.last_name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-gris-600 hover:bg-amber-950/10"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              Nueva Contraseña
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-xl border border-gris-200 bg-white px-3 pr-10 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-400 hover:text-amber-950"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              Confirmar Contraseña
            </label>
            <div className="mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 w-full rounded-xl border border-gris-200 bg-white px-3 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          {/* Requisitos de seguridad */}
          <div className="rounded-2xl border border-amber-950/10 bg-white p-3 text-xs text-gris-700">
            <span className="font-bold text-amber-950">Requisitos de seguridad:</span>
            <ul className="mt-1.5 space-y-1 text-[11px]">
              <li className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gris-500'}`}>
                <ShieldCheck className="size-3.5" /> Mínimo 8 caracteres
              </li>
              <li className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-700 font-semibold' : 'text-gris-500'}`}>
                <ShieldCheck className="size-3.5" /> Mayúsculas y minúsculas
              </li>
              <li className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-gris-500'}`}>
                <ShieldCheck className="size-3.5" /> Al menos un número
              </li>
            </ul>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading || !password}>
              {loading ? 'Guardando...' : 'Actualizar Contraseña'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
