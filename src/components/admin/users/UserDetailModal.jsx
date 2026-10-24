import {
  X,
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Target,
  Award,
  Smartphone,
  CheckCircle2,
  XCircle,
  Bell,
  KeyRound,
  Edit,
  Loader2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { resolveImageUrl } from '@/api/client'
import { getUserRole } from '@/hooks/admin/useUsersList'

function formatDate(isoString) {
  if (!isoString) return 'No disponible'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || 'U'
}

export default function UserDetailModal({
  user,
  roles = [],
  currentAuthUser = null,
  loading = false,
  onClose,
  onOpenEdit,
  onOpenPassword,
  onToggleStatus,
}) {
  const navigate = useNavigate()
  if (!user) return null

  const { roleName, isAdmin: isUserAdmin } = getUserRole(user, roles, currentAuthUser)

  const handleGoToNotifications = () => {
    onClose()
    navigate(`/admin/notifications?targetUser=${user.user_id}`)
  }

  const avatarSrc = resolveImageUrl(user.profile_picture_url)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/45 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        {/* Encabezado y botón cerrar */}
        <div className="flex items-start justify-between border-b border-amber-950/10 pb-5">
          <div className="flex items-center gap-4">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`${user.first_name} ${user.last_name}`}
                className="size-16 rounded-2xl object-cover ring-2 ring-amber-500/40"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-900 text-xl font-black text-amber-100 shadow-inner">
                {getInitials(user.first_name, user.last_name)}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold text-amber-950 sm:text-2xl">
                  {user.first_name} {user.last_name}
                </h3>
                <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-xs font-bold text-amber-900">
                  ID #{user.user_id}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-gris-700">
                <Mail className="size-3.5 text-amber-700" />
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gris-600 transition hover:bg-amber-950/10 hover:text-amber-950"
            aria-label="Cerrar detalle"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Badges de rol y estado */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${
              isUserAdmin
                ? 'bg-amber-950 text-white shadow-xs'
                : 'border border-amber-950/15 bg-white text-amber-900'
            }`}
          >
            {isUserAdmin ? (
              <Shield className="size-3.5 text-amber-400" />
            ) : (
              <Compass className="size-3.5 text-amber-700" />
            )}
            Rol: {roleName}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              user.is_active
                ? 'bg-emerald-100/80 text-emerald-900'
                : 'bg-gris-100 text-gris-600'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                user.is_active ? 'bg-emerald-600' : 'bg-gris-400'
              }`}
            />
            {user.is_active ? 'Cuenta Activa' : 'Cuenta Inactiva / Suspendida'}
          </div>
        </div>

        {/* Indicador de carga si se están trayendo conteos */}
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-800">
            <Loader2 className="size-3.5 animate-spin" /> Actualizando actividad turística...
          </div>
        )}

        {/* Tarjetas de Métricas de Actividad Turística */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
            Actividad en la Plataforma
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-amber-950/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-semibold text-gris-600">Visitas</span>
                <MapPin className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-950">
                {user.visits_count ?? 0}
              </p>
              <span className="text-[11px] text-gris-500">Lugares registrados</span>
            </div>

            <div className="rounded-2xl border border-amber-950/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-indigo-700">
                <span className="text-xs font-semibold text-gris-600">Retos</span>
                <Target className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-950">
                {user.challenges_count ?? 0}
              </p>
              <span className="text-[11px] text-gris-500">Participaciones</span>
            </div>

            <div className="rounded-2xl border border-amber-950/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-semibold text-gris-600">Insignias</span>
                <Award className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-950">
                {user.badges_count ?? 0}
              </p>
              <span className="text-[11px] text-gris-500">Desbloqueadas</span>
            </div>

            <div className="rounded-2xl border border-amber-950/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-semibold text-gris-600">Dispositivos</span>
                <Smartphone className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-950">
                {user.push_tokens_count ?? (user.push_tokens?.length || 0)}
              </p>
              <span className="text-[11px] text-gris-500">Para notificaciones</span>
            </div>
          </div>
        </div>

        {/* Metadatos de Registro */}
        <div className="mt-6 rounded-2xl border border-amber-950/10 bg-white/70 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
            Registro y Auditoría
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-gris-700">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-amber-700" />
              <div>
                <span className="font-semibold text-amber-950">Fecha de registro: </span>
                {formatDate(user.created_at)}
              </div>
            </div>
            {user.updated_at && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-amber-700" />
                <div>
                  <span className="font-semibold text-amber-950">Última actualización: </span>
                  {formatDate(user.updated_at)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones principales */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-amber-950/10 pt-5">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGoToNotifications}
              className="gap-1.5"
            >
              <Bell className="size-4 text-amber-700" /> Enviar notificación
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                onOpenPassword(user)
              }}
              className="gap-1.5"
            >
              <KeyRound className="size-4 text-amber-700" /> Contraseña
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onClose()
                onOpenEdit(user)
              }}
              className="gap-1.5"
            >
              <Edit className="size-4" /> Editar Usuario
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
