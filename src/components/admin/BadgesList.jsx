import { Plus, Award, Search, Medal, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import BadgeModal from './BadgeModal'
import ConfirmModal from './ConfirmModal'
import { resolveImageUrl } from '@/api/client'
import { useBadgesList } from '@/hooks/admin/useBadgesList'

export default function BadgesList() {
  const {
    challengesCount,
    loading,
    error,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    filteredBadges,
    modalOpen,
    setModalOpen,
    badgeToEdit,
    badgeToDelete,
    setBadgeToDelete,
    deleteLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleBadgeSaved,
    handleConfirmDelete,
  } = useBadgesList()

  const deleteCount = badgeToDelete ? challengesCount[badgeToDelete.badge_id] || 0 : 0
  const inUse = deleteCount > 0

  return (
    <div className="space-y-8">
      {/* Encabezado y acción principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-amber-500 pl-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
            Insignias
          </h1>
          <p className="mt-1 text-base text-gris-700">
            Administra las insignias que los usuarios obtienen al completar retos.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="size-4" /> Agregar Insignia
        </Button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar insignia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          aria-label="Ordenar por"
          className=" cursor-pointer h-12 rounded-2xl px-4 text-sm font-semibold text-amber-950 outline-none transition focus:border-amber-600 focus:ring-1 focus:ring-amber-700"
        >
          <option value="newest">Más recientes primero</option>
          <option value="oldest">Más antiguos primero</option>
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Grid de insignias */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 animate-pulse rounded-3xl bg-amber-100/50" />
          ))}
        </div>
      ) : filteredBadges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Medal className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {search ? 'No se encontraron insignias' : 'No hay insignias registradas'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gris-700">
            {search
              ? 'Prueba con otro término de búsqueda.'
              : 'Crea la primera insignia para poder asignarla a un reto.'}
          </p>
          {!search && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="size-4" /> Agregar Insignia
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBadges.map((badge) => {
            const count = challengesCount[badge.badge_id] || 0
            return (
              <article
                key={badge.badge_id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Ícono */}
                <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-amber-100 p-6">
                  {badge.icon_url ? (
                    <img
                      src={resolveImageUrl(badge.icon_url)}
                      alt={badge.badge_name}
                      className="h-full object-contain transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <Award className="size-16 text-amber-600 opacity-80" />
                  )}

                  <span className="absolute bottom-3 left-3 rounded-full bg-amber-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {count} {count === 1 ? 'reto' : 'retos'}
                  </span>

                  {/* Acciones rápidas */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
                    <button
                      type="button"
                      title="Editar insignia"
                      onClick={(e) => handleOpenEdit(e, badge)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-amber-700"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar insignia"
                      onClick={(e) => handleOpenDelete(e, badge)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error shadow-sm backdrop-blur-md transition hover:bg-error hover:text-white"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-amber-950">{badge.badge_name}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-gris-700">{badge.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Modal para crear o editar insignia */}
      <BadgeModal
        isOpen={modalOpen}
        badge={badgeToEdit}
        onClose={() => setModalOpen(false)}
        onSaved={handleBadgeSaved}
      />

      {/* Confirmación o bloqueo para eliminar insignia */}
      <ConfirmModal
        isOpen={Boolean(badgeToDelete)}
        isWarningOnly={inUse}
        title={inUse ? `No puedes eliminar ${badgeToDelete?.badge_name}` : `¿Eliminar ${badgeToDelete?.badge_name}?`}
        message={
          inUse
            ? `Esta insignia está asignada a ${deleteCount} ${
                deleteCount === 1 ? 'reto' : 'retos'
              }. No es posible eliminarla hasta que no tenga ningún reto asociado.`
            : 'Se eliminará esta insignia de la plataforma. Las que los usuarios ya hayan obtenido se conservan en su historial.'
        }
        confirmText="Eliminar Insignia"
        loading={deleteLoading}
        onClose={() => setBadgeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}