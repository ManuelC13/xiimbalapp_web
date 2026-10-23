import { useState } from 'react'
import {
  Plus, Target, Search, Pencil, Trash2, Award, MapPin, Calendar,
  Copy, Check, RefreshCw, KeyRound,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import ChallengeModal from './ChallengeModal'
import ConfirmModal from './ConfirmModal'
import { resolveImageUrl } from '@/api/client'
import { useChallengesList } from '@/hooks/admin/useChallengesList'

const STATUS = {
  active: { label: 'Activo', cls: 'bg-success-light text-success' },
  inactive: { label: 'Inactivo', cls: 'bg-gris-100 text-gris-700' },
  postponed: { label: 'Pospuesto', cls: 'bg-amber-200 text-amber-900' },
}

const TYPE = {
  platform: { label: 'Plataforma', cls: 'bg-amber-400 text-amber-950' },
  place: { label: 'Negocio', cls: 'bg-amber-900 text-white' },
}

const FILTER_BTN = (active) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer ${
    active ? 'bg-amber-900 text-white shadow-sm' : 'border border-gris-100 bg-white text-amber-900 hover:bg-amber-100'
  }`

const formatDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : null

function CodeRow({ challenge, regenerating, onRegenerate }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(challenge.verification_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-amber-50 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <KeyRound className="size-4 shrink-0 text-amber-800" />
        <span className="truncate font-mono text-sm font-bold tracking-widest text-amber-950">
          {challenge.verification_code || '—'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          title="Copiar código"
          onClick={copy}
          className="flex size-8 items-center justify-center rounded-full text-amber-950 transition hover:bg-amber-200"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
        <button
          type="button"
          title="Generar nuevo código"
          disabled={regenerating}
          onClick={() => onRegenerate(challenge)}
          className="flex size-8 items-center justify-center rounded-full text-amber-950 transition hover:bg-amber-200 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${regenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

export default function ChallengesList() {
  const {
    badges, places, categories, towns,
    badgesById, placesById, categoriesById, townsById,
    loading, error,
    search, setSearch,
    sortOrder, setSortOrder,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    filteredChallenges,
    modalOpen, setModalOpen,
    challengeToEdit,
    challengeToDelete, setChallengeToDelete,
    deleteLoading, regeneratingId,
    handleOpenCreate, handleOpenEdit, handleOpenDelete,
    handleChallengeSaved, handleConfirmDelete, handleRegenerateCode,
  } = useChallengesList()

  const hasFilters = search || typeFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="space-y-8">
      {/* Encabezado y acción principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-amber-500 pl-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">Retos</h1>
          <p className="mt-1 text-base text-gris-700">
            Administra los retos de plataforma y de negocios que otorgan insignias.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="size-4" /> Agregar Reto
        </Button>
      </div>

      {/* Buscador y filtros */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
            <input
              type="search"
              placeholder="Buscar reto o insignia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-15 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[['all', 'Todos'], ['platform', 'Plataforma'], ['place', 'Negocio']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setTypeFilter(id)} className={FILTER_BTN(typeFilter === id)}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[['all', 'Cualquier estado'], ['active', 'Activos'], ['inactive', 'Inactivos'], ['postponed', 'Pospuestos']].map(
              ([id, label]) => (
                <button key={id} type="button" onClick={() => setStatusFilter(id)} className={FILTER_BTN(statusFilter === id)}>
                  {label}
                </button>
              )
            )}
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Ordenar por"
            className="cursor-pointer h-12 rounded-2xl px-4 text-sm font-semibold text-amber-900 outline-none transition focus:border-amber-600 focus:ring-1 focus:ring-amber-700"
          >
            <option value="newest">Más recientes primero</option>
            <option value="oldest">Más antiguos primero</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Grid de retos */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-amber-100/50" />
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Target className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {hasFilters ? 'No se encontraron retos' : 'No hay retos registrados'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gris-700">
            {hasFilters
              ? 'Prueba con otros filtros o términos de búsqueda.'
              : badges.length === 0
                ? 'Primero crea al menos una insignia en la pestaña Insignias para poder asignarla a un reto.'
                : 'Crea el primer reto para incentivar la exploración de los usuarios.'}
          </p>
          {!hasFilters && badges.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="size-4" /> Agregar Reto
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((c) => {
            const badge = badgesById[c.badge_id]
            const place = placesById[c.place_id]
            const isPlace = c.challenge_type === 'place'
            const status = STATUS[c.status] || STATUS.active
            const type = TYPE[c.challenge_type] || TYPE.platform
            const start = formatDate(c.start_date)
            const end = formatDate(c.end_date)
            const filters = [townsById[c.magical_town_id]?.name, categoriesById[c.category_id]?.name ?? categoriesById[c.category_id]?.category_name].filter(Boolean)

            return (
              <article
                key={c.challenge_id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Cabecera con badges de tipo/estado y acciones */}
                <div className="flex items-start justify-between gap-2 bg-amber-100 p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${type.cls}`}>{type.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Editar reto"
                      onClick={(e) => handleOpenEdit(e, c)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-sm transition hover:bg-white hover:text-amber-700"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar reto"
                      onClick={(e) => handleOpenDelete(e, c)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error shadow-sm transition hover:bg-error hover:text-white"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-950">{c.challenge_name}</h3>
                    <p className="mt-1 line-clamp-3 text-sm text-gris-700">{c.description}</p>
                  </div>

                  {/* Insignia que otorga */}
                  <div className="flex items-center gap-3 rounded-2xl border border-gris-100 p-2.5">
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber-100">
                      {badge?.icon_url ? (
                        <img src={resolveImageUrl(badge.icon_url)} alt={badge.badge_name} className="size-full object-contain p-1" />
                      ) : (
                        <Award className="size-5 text-amber-700" />
                      )}
                    </div>
                    <div className="min-w-0 text-xs">
                      <p className="text-gris-700">Otorga la insignia</p>
                      <p className="truncate font-bold text-amber-950">{badge?.badge_name || 'Insignia no disponible'}</p>
                    </div>
                  </div>

                  {/* Condición del reto */}
                  <div className="space-y-1.5 text-sm text-amber-950">
                    {isPlace ? (
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-amber-700" />
                        <span className="truncate">{place?.name || `Lugar #${c.place_id}`}</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-2">
                        <Target className="size-4 shrink-0 text-amber-700" />
                        <span>
                          Visitar {c.target_count} {c.target_count === 1 ? 'lugar' : 'lugares'}
                          {filters.length > 0 && ` · ${filters.join(' · ')}`}
                        </span>
                      </p>
                    )}
                    {(start || end) && (
                      <p className="flex items-center gap-2 text-gris-700">
                        <Calendar className="size-4 shrink-0 text-amber-700" />
                        <span>{start || 'Sin inicio'} → {end || 'Sin fin'}</span>
                      </p>
                    )}
                    {c.reward && <p className="text-xs text-gris-700">Recompensa: {c.reward}</p>}
                  </div>

                  {isPlace && (
                    <div className="mt-auto">
                      <CodeRow
                        challenge={c}
                        regenerating={regeneratingId === c.challenge_id}
                        onRegenerate={handleRegenerateCode}
                      />
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Modal para crear o editar reto */}
      <ChallengeModal
        isOpen={modalOpen}
        challenge={challengeToEdit}
        badges={badges}
        places={places}
        categories={categories}
        towns={towns}
        onClose={() => setModalOpen(false)}
        onSaved={handleChallengeSaved}
      />

      {/* Confirmación para eliminar reto */}
      <ConfirmModal
        isOpen={Boolean(challengeToDelete)}
        title={`¿Eliminar ${challengeToDelete?.challenge_name}?`}
        message="Se eliminará este reto de la plataforma y dejará de mostrarse a los usuarios. El historial de quienes ya lo completaron se conserva."
        confirmText="Eliminar Reto"
        loading={deleteLoading}
        onClose={() => setChallengeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}