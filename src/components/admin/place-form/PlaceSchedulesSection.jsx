import { Clock, Copy, RotateCcw } from 'lucide-react'

const TIME_INPUT =
  'h-10 rounded-xl border border-gris-100 bg-white px-3 text-sm text-amber-950 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

const STATUS_OPTIONS = [
  { value: 'unset', label: 'Sin definir' },
  { value: 'open', label: 'Abierto' },
  { value: 'closed', label: 'Cerrado' },
]

export default function PlaceSchedulesSection({
  schedules,
  onChangeDay,
  onApplyFirstOpenToAll,
  onResetAll,
}) {
  const hasAnyOpen = schedules.some((d) => d.status === 'open')
  const hasAnyDefined = schedules.some((d) => d.status !== 'unset')

  return (
    <section className="border-t border-amber-950/10 pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-amber-800" />
            <h2 className="text-xl font-bold text-amber-950">Horarios de atención</h2>
          </div>
          <p className="mt-1 text-xs text-gris-700">
            Define los días y horarios en que este lugar recibe visitantes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {hasAnyOpen && (
            <button
              type="button"
              onClick={onApplyFirstOpenToAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-950/20 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950 transition hover:bg-amber-100 cursor-pointer"
              title="Copia el horario del primer día abierto al resto de la semana"
            >
              <Copy className="size-3.5" />
              Aplicar horario a todos
            </button>
          )}
          {hasAnyDefined && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-gris-100 bg-white px-3 py-1.5 text-xs font-semibold text-gris-700 transition hover:bg-amber-50 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {schedules.map((day) => {
          const invalidRange =
            day.status === 'open' &&
            day.opening_time &&
            day.closing_time &&
            day.closing_time <= day.opening_time

          return (
            <div
              key={day.day_of_week}
              className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition sm:flex-row sm:items-center sm:justify-between ${invalidRange
                  ? 'border-border-error bg-background-error/40'
                  : 'border-gris-100 bg-amber-50/40'
                }`}
            >
              <div className="flex items-center justify-between gap-3 sm:min-w-44">
                <span className="text-sm font-bold text-amber-950">{day.label}</span>

                <div className="inline-flex rounded-full border border-gris-100 bg-white p-0.5">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = day.status === opt.value
                    let activeClass = 'bg-amber-950 text-white'
                    if (active && opt.value === 'open') activeClass = 'bg-success text-white'
                    if (active && opt.value === 'closed') activeClass = 'bg-error text-white'

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChangeDay(day.day_of_week, { status: opt.value })}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${active
                            ? activeClass
                            : 'text-gris-700 hover:text-amber-950'
                          }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {day.status === 'open' ? (
                <div className="flex flex-col gap-1 sm:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gris-700">
                      <span>Abre</span>
                      <input
                        type="time"
                        value={day.opening_time}
                        onChange={(e) =>
                          onChangeDay(day.day_of_week, { opening_time: e.target.value })
                        }
                        className={TIME_INPUT}
                        required
                      />
                    </label>
                    <span className="text-xs text-gris-400">a</span>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gris-700">
                      <span>Cierra</span>
                      <input
                        type="time"
                        value={day.closing_time}
                        onChange={(e) =>
                          onChangeDay(day.day_of_week, { closing_time: e.target.value })
                        }
                        className={TIME_INPUT}
                        required
                      />
                    </label>
                  </div>
                  {invalidRange && (
                    <p className="text-xs font-medium text-error">
                      La hora de cierre debe ser mayor que la de apertura.
                    </p>
                  )}
                </div>
              ) : day.status === 'closed' ? (
                <span className="text-xs font-semibold text-error">Cerrado todo el día</span>
              ) : (
                <span className="text-xs text-gris-400">No especificado</span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

