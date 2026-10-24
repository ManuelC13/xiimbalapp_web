import { Smartphone, Users, RefreshCw } from 'lucide-react'

export default function NotificationHeader({ stats, loadingStats, loadingHistory, onRefresh }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="border-l-4 border-amber-500 pl-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
          Notificaciones Push
        </h1>
        <p className="mt-1 text-base text-gris-700">
          Redacta y envía notificaciones instantáneas a los usuarios de la app móvil.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Contador de Dispositivos */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
            <Smartphone className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Dispositivos
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loadingStats ? '...' : stats.total_devices}
            </p>
          </div>
        </div>

        {/* Contador de Usuarios con App */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-success-light text-success">
            <Users className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Usuarios con App
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loadingStats ? '...' : stats.total_users_with_devices}
            </p>
          </div>
        </div>

        {/* Botón de refrescar */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refrescar métricas e historial"
          className="flex size-11 items-center justify-center rounded-2xl border border-gris-100 bg-white text-amber-950 shadow-sm transition hover:bg-amber-100 cursor-pointer"
        >
          <RefreshCw className={`size-4 ${loadingStats || loadingHistory ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}
