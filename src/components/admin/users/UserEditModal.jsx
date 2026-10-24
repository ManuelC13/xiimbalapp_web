import { useState, useEffect } from 'react'
import { X, User, Mail, Shield, CheckCircle2, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function UserEditModal({
  user,
  roles = [],
  loading = false,
  onClose,
  onSave,
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setEmail(user.email || '')
      setRoleId(user.role_id || 1)
      setIsActive(Boolean(user.is_active))
      setError('')
    }
  }, [user])

  if (!user) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanFirst = firstName.trim()
    const cleanLast = lastName.trim()
    const cleanEmail = email.trim()

    if (!cleanFirst || !cleanLast) {
      setError('Nombre y apellido son obligatorios.')
      return
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Proporciona un correo electrónico válido.')
      return
    }

    onSave({
      first_name: cleanFirst,
      last_name: cleanLast,
      email: cleanEmail,
      role_id: Number(roleId),
      is_active: isActive,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/10 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-amber-950">Editar Usuario</h3>
            <p className="text-xs text-gris-600">ID #{user.user_id} &bull; Modifica los datos de la cuenta</p>
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
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nombres */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
                Nombre(s)
              </label>
              <div className="relative mt-1">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gris-200 bg-white pl-9 pr-3 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
                Apellido(s)
              </label>
              <div className="relative mt-1">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris-400" />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gris-200 bg-white pl-9 pr-3 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              Correo Electrónico
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-gris-200 bg-white pl-9 pr-3 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              Rol del Usuario
            </label>
            <div className="relative mt-1">
              <Shield className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris-400" />
              <select
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-gris-200 bg-white pl-9 pr-3 text-sm text-gris-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
              >
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.role_name} {r.description ? `(${r.description})` : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>Turista</option>
                    <option value={2}>Admin</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Estado de la cuenta */}
          <div className="rounded-2xl border border-amber-950/10 bg-white p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950">Estado de la cuenta</span>
                <p className="text-[11px] text-gris-600">
                  {isActive
                    ? 'La cuenta puede iniciar sesión normalmente.'
                    : 'La cuenta está suspendida y bloqueada para iniciar sesión.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-600" /> Activo
                  </>
                ) : (
                  <>
                    <XCircle className="size-3.5 text-rose-600" /> Inactivo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
