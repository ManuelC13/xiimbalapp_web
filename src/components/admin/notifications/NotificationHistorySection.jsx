import { useState } from 'react'
import { Bell, Calendar, RefreshCw, Compass, Users, Check, Search } from 'lucide-react'
import { formatUtcDateTime } from '@/utils/dateUtils'

export default function NotificationHistorySection({
  history,
  screens,
  loadingHistory,
  onRefresh,
}) {
  const [search, setSearch] = useState('')

  const filteredHistory = history.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.title?.toLowerCase().includes(q) ||
      item.body?.toLowerCase().includes(q) ||
      item.screen?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y botón de refrescar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar en el historial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm text-amber-950 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gris-100 bg-white px-5 py-2.5 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-100 cursor-pointer"
        >
          <RefreshCw className={`size-4 ${loadingHistory ? 'animate-spin' : ''}`} />
          Actualizar Historial
        </button>
      </div>

      {/* Lista de Notificaciones o Estado Vacío */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Bell className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {search ? 'No se encontraron notificaciones' : 'No hay notificaciones enviadas'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gris-700">
            {search
              ? 'Prueba con otro término de búsqueda en el historial.'
              : 'Las notificaciones personalizadas que envíes desde este panel quedarán registradas aquí.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map((item) => {
            const dateStr = item.sent_at
              ? formatUtcDateTime(item.sent_at, { month: 'short' })
              : 'Fecha desconocida'

            const screenLabel =
              screens.find((s) => s.id === item.screen)?.label || item.screen || 'Inicio'

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-gris-100 bg-white p-6 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950">
                      #{item.id}
                    </span>
                    <h3 className="text-base font-bold text-amber-950">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gris-400 font-medium">
                    <Calendar className="size-3.5" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                <p className="text-sm text-gris-700 leading-relaxed">{item.body}</p>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gris-100/60">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-gris-100">
                    <Compass className="size-3.5 text-amber-800" />
                    Destino: {screenLabel}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gris-100 bg-white px-3 py-1 text-xs font-semibold text-gris-700">
                    <Users className="size-3.5" />
                    {item.target_type === 'specific' ? 'Usuarios específicos' : 'Difusión masiva'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-bold text-success">
                    <Check className="size-3.5" />
                    {item.target_count} dispositivo(s)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
