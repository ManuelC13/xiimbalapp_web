import { Plus, Search, Tag, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import CategoryModal from './CategoryModal'
import ConfirmModal from './ConfirmModal'
import { useCategoriesList } from '@/hooks/admin/useCategoriesList'

export default function CategoriesList() {
  const {
    placeTypes,
    placesCount,
    loading,
    error,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    groups,
    modalOpen,
    setModalOpen,
    categoryToEdit,
    categoryToDelete,
    setCategoryToDelete,
    deleteLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCategorySaved,
    handleConfirmDelete,
  } = useCategoriesList()

  const hasFilters = Boolean(search.trim()) || typeFilter !== 'all'
  const deleteCount = categoryToDelete ? placesCount[categoryToDelete.category_id] || 0 : 0
  const deleteBlocked = deleteCount > 0

  return (
    <div className="space-y-8">
      {/* Encabezado y acción principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-amber-500 pl-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
            Categorías
          </h1>
          <p className="mt-1 text-base text-gris-700">
            Administra las categorías que se asignan a los lugares al crearlos o editarlos.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="size-4" /> Agregar Categoría
        </Button>
      </div>

      {/* Buscador y filtro por tipo de lugar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gris-100 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {placeTypes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {[{ place_type_id: 'all', type_name: 'Todas' }, ...placeTypes].map((type) => {
              const active = typeFilter === type.place_type_id
              return (
                <button
                  key={type.place_type_id}
                  type="button"
                  onClick={() => setTypeFilter(type.place_type_id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-amber-900 text-white'
                      : 'border border-gris-100 bg-white text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {type.type_name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Listado agrupado por tipo de lugar */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-amber-100/50" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Tag className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {hasFilters ? 'No se encontraron categorías' : 'No hay categorías registradas'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gris-700">
            {hasFilters
              ? 'Prueba con otro término de búsqueda o cambia el filtro.'
              : 'Agrega la primera categoría para poder clasificar los lugares turísticos.'}
          </p>
          {!hasFilters && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="size-4" /> Agregar Categoría
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.typeId} className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-amber-950">
                {group.typeName}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                  {group.items.length}
                </span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((category) => {
                  const count = placesCount[category.category_id] || 0
                  return (
                    <article
                      key={category.category_id}
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-md shadow-amber-950/5 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                          <Tag className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-amber-950">
                            {category.category_name}
                          </h3>
                          <p className="text-xs text-gris-700">
                            {count} {count === 1 ? 'lugar' : 'lugares'}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          title="Editar categoría"
                          onClick={() => handleOpenEdit(category)}
                          className="flex size-8 items-center justify-center rounded-full bg-amber-50 text-amber-950 transition hover:bg-amber-100 hover:text-amber-700"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Eliminar categoría"
                          onClick={() => handleOpenDelete(category)}
                          className="flex size-8 items-center justify-center rounded-full bg-amber-50 text-error transition hover:bg-error hover:text-white"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal para crear o editar categoría */}
      <CategoryModal
        isOpen={modalOpen}
        category={categoryToEdit}
        placeTypes={placeTypes}
        defaultPlaceTypeId={typeFilter !== 'all' ? typeFilter : null}
        onClose={() => setModalOpen(false)}
        onSaved={handleCategorySaved}
      />

      {/* Confirmación o bloqueo al eliminar */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        isWarningOnly={deleteBlocked}
        title={
          deleteBlocked
            ? `No puedes eliminar ${categoryToDelete?.category_name}`
            : `¿Eliminar ${categoryToDelete?.category_name}?`
        }
        message={
          deleteBlocked
            ? `Esta categoría la usan ${deleteCount} ${
                deleteCount === 1 ? 'lugar' : 'lugares'
              }. Quítala de esos lugares antes de eliminarla.`
            : 'Se eliminará esta categoría de la plataforma. Esta acción no se puede deshacer.'
        }
        confirmText="Eliminar Categoría"
        loading={deleteLoading}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}