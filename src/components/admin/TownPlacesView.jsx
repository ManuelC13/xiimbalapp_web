import { ArrowLeft, Plus, MapPin, Tag, Compass, Search, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import TownModal from './TownModal'
import ConfirmModal from './ConfirmModal'
import { resolveImageUrl } from '@/api/places'
import { useTownPlaces } from '@/hooks/admin/useTownPlaces'

export default function TownPlacesView({ town: propTown, onBack }) {
  const {
    currentTown,
    placesList,
    filteredPlaces,
    categories,
    loading,
    error,
    search,
    setSearch,
    placeToDelete,
    setPlaceToDelete,
    placeDeleteLoading,
    galleryPlace,
    setGalleryPlace,
    townModalOpen,
    setTownModalOpen,
    townToDelete,
    setTownToDelete,
    townDeleteLoading,
    handleBack,
    handleOpenCreatePlace,
    handleOpenEditPlace,
    handleOpenDeletePlace,
    handleConfirmDeletePlace,
    handleTownSaved,
    handleConfirmDeleteTown,
  } = useTownPlaces({ propTown, onBack })

  return (
    <div className="space-y-8">
      {/* Barra superior con navegación */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-base font-semibold text-amber-950 transition hover:text-amber-800"
        >
          <ArrowLeft className="size-5" />
          <span>Volver a Pueblos Mágicos</span>
        </button>

        <div className="flex items-center gap-3">
          <Button onClick={handleOpenCreatePlace} size="sm">
            <Plus className="size-4" /> Agregar Lugar
          </Button>
        </div>
      </div>

      {/* Banner del Pueblo Mágico seleccionado */}
      <div className="relative overflow-hidden rounded-3xl bg-amber-950 text-white shadow-xl shadow-amber-950/10">
        {currentTown?.image_url && (
          <img
            src={resolveImageUrl(currentTown.image_url)}
            alt={currentTown.name}
            className="absolute inset-0 size-full object-cover opacity-35"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div className="relative flex flex-col justify-between gap-6 p-8 sm:flex-row sm:items-end sm:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-sm font-medium backdrop-blur-md">
              <MapPin className="size-4 text-amber-400" />
              <span>Pueblo Mágico</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {currentTown?.name}
            </h2>
            <p className="mt-2 text-amber-100/90">
              {placesList.length} {placesList.length === 1 ? 'lugar registrado' : 'lugares registrados'}
            </p>
          </div>

          {/* Acciones para editar o eliminar el pueblo actual */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTownModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition hover:bg-white hover:text-amber-950"
            >
              <Pencil className="size-3.5" /> Editar Pueblo
            </button>
            <button
              type="button"
              onClick={() => setTownToDelete(currentTown)}
              className="inline-flex items-center gap-1.5 rounded-full bg-error/80 px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition hover:bg-error"
            >
              <Trash2 className="size-3.5" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Buscador de lugares */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gris-400" />
          <input
            type="search"
            placeholder="Buscar lugares por nombre o dirección..."
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

      {/* Lista de lugares */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-amber-100/50" />
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-950/20 bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Compass className="size-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-amber-950">
            {search ? 'No se encontraron lugares' : 'Aún no hay lugares registrados'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gris-700">
            {search
              ? 'Prueba buscando con otro término.'
              : `Comienza agregando atractivos turísticos, cenotes, templos o negocios de ${currentTown?.name}.`}
          </p>
          {!search && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleOpenCreatePlace} size="sm">
                <Plus className="size-4" /> Agregar el primer lugar
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((place) => {
            const rawCover = place.images?.[0]?.image_url
            const coverImage = resolveImageUrl(rawCover)
            const lat = place.latitude != null ? parseFloat(place.latitude) : null
            const lng = place.longitude != null ? parseFloat(place.longitude) : null
            const hasCoords = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)
            const photosCount = place.images?.length || 0

            return (
              <article
                key={place.place_id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Imagen del lugar */}
                <div className="relative h-48 w-full bg-amber-100">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={place.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-linear-to-br from-amber-200 to-amber-300 text-amber-950/60">
                      <MapPin className="size-10" />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
                      place.is_active
                        ? 'bg-success-light/90 text-success'
                        : 'bg-background-error/90 text-error'
                    }`}
                  >
                    {place.is_active ? 'Activo' : 'Inactivo'}
                  </span>

                  {/* Botón flotante para ver galería / número de fotos */}
                  <button
                    type="button"
                    title="Ver y agregar fotos"
                    onClick={() => setGalleryPlace(place)}
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-amber-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-amber-950"
                  >
                    <ImageIcon className="size-3.5" />
                    {photosCount} {photosCount === 1 ? 'foto' : 'fotos'}
                  </button>

                  {/* Acciones para el lugar: Editar y Eliminar */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
                    <button
                      type="button"
                      title="Editar lugar"
                      onClick={() => handleOpenEditPlace(place)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-amber-700"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar lugar"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDeletePlace(place)
                      }}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error shadow-sm backdrop-blur-md transition hover:bg-error hover:text-white"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-amber-950">{place.name}</h3>

                  {place.address && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gris-700">
                      <MapPin className="size-3.5 shrink-0 text-amber-700" />
                      <span className="line-clamp-1">{place.address}</span>
                    </p>
                  )}

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gris-700">
                    {place.description}
                  </p>

                  {/* Coordenadas */}
                  {hasCoords && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gris-400">
                      <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                    </div>
                  )}

                  {/* Categorías asociadas */}
                  {Array.isArray(place.category_ids) && place.category_ids.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gris-100 pt-3">
                      {place.category_ids.map((catId) => (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950"
                        >
                          <Tag className="size-3 text-amber-700" />
                          {categories[catId] || `Cat #${catId}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Modal para editar pueblo actual */}
      <TownModal
        isOpen={townModalOpen}
        town={currentTown}
        onClose={() => setTownModalOpen(false)}
        onSaved={handleTownSaved}
      />

      {/* Modal de confirmación para eliminar lugar */}
      <ConfirmModal
        isOpen={Boolean(placeToDelete)}
        title={`¿Eliminar ${placeToDelete?.name}?`}
        message="¿Estás seguro de que deseas eliminar este lugar? Se marcará como inactivo/eliminado en la plataforma."
        confirmText="Eliminar Lugar"
        loading={placeDeleteLoading}
        onClose={() => setPlaceToDelete(null)}
        onConfirm={handleConfirmDeletePlace}
      />

      {/* Modal de confirmación o bloqueo para eliminar pueblo actual */}
      {(() => {
        const hasPlaces = placesList.length > 0
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
                ? `Este pueblo mágico contiene ${placesList.length} ${
                    placesList.length === 1 ? 'lugar registrado' : 'lugares registrados'
                  }. Para poder eliminarlo, debes eliminar todos sus lugares primero.`
                : 'Se eliminará este pueblo mágico de la plataforma. Esta acción no se puede deshacer.'
            }
            confirmText="Eliminar Pueblo"
            loading={townDeleteLoading}
            onClose={() => setTownToDelete(null)}
            onConfirm={handleConfirmDeleteTown}
          />
        )
      })()}
    </div>
  )
}
