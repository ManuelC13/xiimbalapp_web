import { X, MapPin, Tag, Upload, Link as LinkIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import { usePlaceModal } from '@/hooks/admin/usePlaceModal'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'
const TEXTAREA =
  'w-full rounded-2xl border border-gris-100 bg-white p-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function PlaceModal({ isOpen, place = null, town, onClose, onSaved }) {
  const {
    isEditing,
    name,
    setName,
    description,
    setDescription,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    historicalInfo,
    setHistoricalInfo,
    isActive,
    setIsActive,
    selectedCategories,
    categories,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    loading,
    error,
    toggleCategory,
    handleFileChange,
    handleSubmit,
  } = usePlaceModal({ isOpen, place, town, onClose, onSaved })

  if (!isOpen || (!town && !place)) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-amber-950/40 p-4 py-8 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <MapPin className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-amber-950">
                {isEditing ? 'Editar Lugar' : 'Nuevo Lugar'}
              </h2>
              <p className="text-sm text-gris-700">
                {town?.name ? `En ${town.name}` : ''}
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label htmlFor="place-name" className="text-sm font-semibold text-amber-950">
              Nombre del lugar <span className="text-error">*</span>
            </label>
            <input
              id="place-name"
              type="text"
              required
              placeholder="Ej. Convento de San Antonio, Cenote Xkekén..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="place-desc" className="text-sm font-semibold text-amber-950">
              Descripción <span className="text-error">*</span>
            </label>
            <textarea
              id="place-desc"
              required
              rows={3}
              placeholder="Describe los atractivos y lo que ofrece este lugar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={TEXTAREA}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="place-address" className="text-sm font-semibold text-amber-950">
              Dirección
            </label>
            <input
              id="place-address"
              type="text"
              placeholder="Calle o referencia en el pueblo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={INPUT}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="place-lat" className="text-sm font-semibold text-amber-950">
                Latitud <span className="text-error">*</span>
              </label>
              <input
                id="place-lat"
                type="number"
                step="any"
                required
                placeholder="Ej. 20.9328"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className={INPUT}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="place-lng" className="text-sm font-semibold text-amber-950">
                Longitud <span className="text-error">*</span>
              </label>
              <input
                id="place-lng"
                type="number"
                step="any"
                required
                placeholder="Ej. -89.0189"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className={INPUT}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="place-history" className="text-sm font-semibold text-amber-950">
              Información histórica o curiosidades
            </label>
            <textarea
              id="place-history"
              rows={2}
              placeholder="Detalles sobre su fundación, leyendas o importancia cultural..."
              value={historicalInfo}
              onChange={(e) => setHistoricalInfo(e.target.value)}
              className={TEXTAREA}
            />
          </div>

          {/* Estado activo/inactivo (en edición) */}
          {isEditing && (
            <div className="flex items-center gap-3 py-1">
              <label className="text-sm font-semibold text-amber-950">Estado:</label>
              <button
                type="button"
                onClick={() => setIsActive((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-success-light text-success hover:bg-green-200'
                    : 'bg-background-error text-error hover:bg-red-200'
                }`}
              >
                <span className={`size-2 rounded-full ${isActive ? 'bg-success' : 'bg-error'}`} />
                {isActive ? 'Activo (Visible en la app)' : 'Inactivo (Oculto)'}
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-950">Categorías</label>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = selectedCategories.includes(cat.category_id)
                  return (
                    <button
                      key={cat.category_id}
                      type="button"
                      onClick={() => toggleCategory(cat.category_id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        active
                          ? 'bg-amber-950 text-white'
                          : 'border border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
                      }`}
                    >
                      <Tag className="size-3.5" />
                      {cat.category_name}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gris-400">Cargando categorías...</p>
            )}
          </div>

          {/* Sección de Fotografía (Física o URL) */}
          <div className="space-y-2 rounded-2xl bg-white p-4 border border-gris-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-amber-950">
                {isEditing ? 'Agregar fotografía' : 'Fotografía del lugar (opcional)'}
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    imageMode === 'file'
                      ? 'bg-amber-950 text-white'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  <Upload className="size-3" /> Subir archivo
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    imageMode === 'url'
                      ? 'bg-amber-950 text-white'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  <LinkIcon className="size-3" /> Enlace URL
                </button>
              </div>
            </div>

            {imageMode === 'file' ? (
              <div className="mt-2">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-950/20 bg-amber-50/50 p-4 transition hover:bg-amber-100/50">
                  <Upload className="size-6 text-amber-800 opacity-70" />
                  <span className="mt-1 text-xs font-semibold text-amber-950">
                    {selectedFile ? selectedFile.name : 'Haz clic para seleccionar una foto de tu dispositivo'}
                  </span>
                  <span className="text-[11px] text-gris-400">JPG, PNG o WEBP (máx. 5 MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {filePreview && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-gris-100 p-2 bg-amber-50/30">
                    <img
                      src={filePreview}
                      alt="Vista previa"
                      className="size-14 rounded-lg object-cover"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-amber-950">{selectedFile?.name}</p>
                      <p className="text-gris-400">
                        {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input
                id="place-image"
                type="url"
                placeholder="https://ejemplo.com/foto-lugar.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={INPUT}
              />
            )}
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
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Lugar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
