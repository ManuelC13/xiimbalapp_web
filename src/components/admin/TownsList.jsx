import { Plus, MapPin, ChevronRight, Search, Sparkles, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import TownModal from './TownModal'
import ConfirmModal from './ConfirmModal'
import { resolveImageUrl } from '@/api/client'
import { useTownsList } from '@/hooks/admin/useTownsList'

export default function TownsList({ onSelectTown }) {
  const {
    placesCount,
    loading,
    error,
    search,
    setSearch,
    filteredTowns,
    modalOpen,
    setModalOpen,
    townToEdit,
    townToDelete,
    setTownToDelete,
    deleteLoading,
    handleSelectTown,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleTownSaved,
    handleConfirmDelete,
  } = useTownsList({ onSelectTown })

  return (
    <div className="space-y-8">
      {/* Encabezado y acción principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-amber-500 pl-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
            Pueblos Mágicos
          </h1>
          <p className="mt-1 text-base text-gris-700">
            Administra los pueblos mágicos de Yucatán y los lugares registrados en cada uno.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="size-4" /> Agregar Pueblo Mágico
        </Button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar pueblo mágico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Grid de Pueblos Mágicos */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-60 animate-pulse rounded-3xl bg-amber-100/50" />
          ))}
        </div>
      ) : filteredTowns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {search ? 'No se encontraron pueblos mágicos' : 'No hay pueblos mágicos registrados'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gris-700">
            {search
              ? 'Prueba con otro término de búsqueda.'
              : 'Agrega el primer pueblo mágico para comenzar a estructurar los lugares turísticos.'}
          </p>
          {!search && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="size-4" /> Agregar Pueblo Mágico
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTowns.map((town) => {
            const count = placesCount[town.magical_town_id] || 0
            return (
              <article
                key={town.magical_town_id}
                onClick={() => handleSelectTown(town)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Portada */}
                <div className="relative h-48 w-full overflow-hidden bg-amber-100">
                  {town.image_url ? (
                    <img
                      src={resolveImageUrl(town.image_url)}
                      alt={town.name}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 text-white">
                      <MapPin className="size-12 opacity-80" />
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 rounded-full bg-amber-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {count} {count === 1 ? 'lugar' : 'lugares'}
                  </span>

                  {/* Botones de acción rápida: Editar y Eliminar */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
                    <button
                      type="button"
                      title="Editar pueblo mágico"
                      onClick={(e) => handleOpenEdit(e, town)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-amber-700"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar pueblo mágico"
                      onClick={(e) => handleOpenDelete(e, town)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error shadow-sm backdrop-blur-md transition hover:bg-error hover:text-white"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info y botón */}
                <div className="flex flex-1 items-center justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-950 transition group-hover:text-amber-700">
                      {town.name}
                    </h3>
                    <p className="mt-1 text-xs text-gris-700">Explorar y gestionar lugares</p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900 transition group-hover:bg-amber-950 group-hover:text-white">
                    <ChevronRight className="size-5" />
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Modal para crear o editar pueblo mágico */}
      <TownModal
        isOpen={modalOpen}
        town={townToEdit}
        onClose={() => setModalOpen(false)}
        onSaved={handleTownSaved}
      />

      {/* Modal de confirmación o bloqueo para eliminar pueblo mágico */}
      {(() => {
        const count = townToDelete ? placesCount[townToDelete.magical_town_id] || 0 : 0
        const hasPlaces = count > 0

        return (
          <ConfirmModal
            isOpen={Boolean(townToDelete)}
            isWarningOnly={hasPlaces}
            title={
              hasPlaces
                ? `No puedes eliminar ${townToDelete?.name}`
                : `¿Eliminar ${townToDelete?.name}?`
            }
            message={
              hasPlaces
                ? `Este pueblo mágico tiene ${count} ${
                    count === 1 ? 'lugar registrado' : 'lugares registrados'
                  }. No es posible eliminarlo hasta que no tenga ningún lugar asociado.`
                : 'Se eliminará este pueblo mágico de la plataforma. Esta acción no se puede deshacer.'
            }
            confirmText="Eliminar Pueblo"
            warningActionText="Ver lugares"
            loading={deleteLoading}
            onClose={() => setTownToDelete(null)}
            onConfirm={handleConfirmDelete}
            onWarningAction={() => {
              const target = townToDelete
              setTownToDelete(null)
              handleSelectTown(target)
            }}
          />
        )
      })()}
    </div>
  )
}
