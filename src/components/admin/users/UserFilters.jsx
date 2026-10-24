import { Search } from 'lucide-react'

const FILTER_BTN = (active) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer ${
    active
      ? 'bg-amber-900 text-white shadow-sm'
      : 'border border-gris-100 bg-white text-amber-900 hover:bg-amber-100'
  }`

export default function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  roles = [],
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar por nombre, apellido, correo o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </div>

      {/* Pestañas / Filtros en formato de botones píldora */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Filtro por Rol */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todos los roles' },
            ...roles.map((r) => ({ id: String(r.role_id), label: r.role_name })),
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleFilter(r.id)}
              className={FILTER_BTN(roleFilter === r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Separador vertical */}
        <div className="hidden h-5 w-px bg-amber-950/15 sm:block" />

        {/* Filtro por Estado */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Cualquier estado' },
            { id: 'active', label: 'Activos' },
            { id: 'inactive', label: 'Inactivos' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={FILTER_BTN(statusFilter === s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-amber-800 underline hover:text-amber-950 cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
