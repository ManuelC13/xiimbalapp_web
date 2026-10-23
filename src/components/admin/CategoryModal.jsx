import { X, Tag } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useCategoryModal } from '@/hooks/admin/useCategoryModal'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function CategoryModal({
  isOpen,
  category = null,
  placeTypes = [],
  defaultPlaceTypeId = null,
  onClose,
  onSaved,
}) {
  const {
    name,
    setName,
    placeTypeId,
    setPlaceTypeId,
    loading,
    error,
    isEditing,
    handleSubmit,
  } = useCategoryModal({ isOpen, category, defaultPlaceTypeId, onClose, onSaved })

  if (!isOpen) return null

  const noTypes = placeTypes.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Tag className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-amber-950">
              {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gris-700 hover:bg-amber-950/10"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="category-name" className="text-sm font-semibold text-amber-950">
              Nombre de la categoría <span className="text-error">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              required
              maxLength={100}
              placeholder="Ej. Cenotes, Haciendas, Museos..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category-type" className="text-sm font-semibold text-amber-950">
              Tipo de lugar <span className="text-error">*</span>
            </label>
            <select
              id="category-type"
              required
              disabled={noTypes}
              value={placeTypeId}
              onChange={(e) => setPlaceTypeId(e.target.value)}
              className={INPUT}
            >
              <option value="" disabled>
                {noTypes ? 'No hay tipos de lugar registrados' : 'Selecciona un tipo'}
              </option>
              {placeTypes.map((type) => (
                <option key={type.place_type_id} value={type.place_type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gris-700">
              Las categorías se agrupan por tipo de lugar.
            </p>
          </div>

          {error && (
            <p className="rounded-xl border border-border-error bg-background-error px-4 py-2.5 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading || noTypes}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}