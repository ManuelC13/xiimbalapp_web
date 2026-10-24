import { Users, CheckCircle2, XCircle, Shield, RotateCw } from 'lucide-react'

export default function UserHeader({ stats, loading, onRefresh }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="border-l-4 border-amber-500 pl-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
          Usuarios
        </h1>
        <p className="mt-1 text-base text-gris-700">
          Administra los usuarios registrados y sus permisos en la plataforma.
        </p>
      </div>

      {/* Contadores compactos en el header */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Total */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
            <Users className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Total
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>

        {/* Activos */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Activos
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loading ? '...' : stats.active}
            </p>
          </div>
        </div>

        {/* Inactivos */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
            <XCircle className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Inactivos
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loading ? '...' : stats.inactive}
            </p>
          </div>
        </div>

        {/* Administradores */}
        <div className="flex items-center gap-3 rounded-2xl border border-gris-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
            <Shield className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gris-400">
              Admins
            </p>
            <p className="text-base font-extrabold text-amber-950">
              {loading ? '...' : stats.admins}
            </p>
          </div>
        </div>

        {/* Botón Refrescar */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refrescar usuarios"
          className="flex size-11 items-center justify-center rounded-2xl border border-gris-100 bg-white text-amber-950 shadow-sm transition hover:bg-amber-100 cursor-pointer"
        >
          <RotateCw className={`size-4 ${loading ? 'animate-spin text-amber-700' : ''}`} />
        </button>
      </div>
    </div>
  )
}
