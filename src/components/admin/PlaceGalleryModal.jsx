import { X, Upload, Link as LinkIcon, Trash2, Image as ImageIcon, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import { resolveImageUrl } from '@/api/places'
import { usePlaceGallery } from '@/hooks/admin/usePlaceGallery'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function PlaceGalleryModal({ isOpen, place, onClose, onImagesUpdated }) {
  const {
    images,
    loading,
    error,
    setError,
    activeMode,
    setActiveMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    actionLoading,
    handleFileChange,
    handleAddImage,
    handleDeleteImage,
  } = usePlaceGallery({ isOpen, place, onImagesUpdated })

  if (!isOpen || !place) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-amber-950/40 p-4 py-8 backdrop-blur-sm">
      <div className="my-auto w-full max-w-3xl rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-amber-950/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <ImageIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-amber-950">
                Galería de Fotos
              </h2>
              <p className="text-sm text-gris-700">{place.name}</p>
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

        {/* Sección para agregar nueva foto */}
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-amber-950">Agregar nueva imagen</h3>

          {/* Selector de modo: Archivo físico o URL */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveMode('file')
                setError('')
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeMode === 'file'
                  ? 'bg-amber-950 text-white'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <Upload className="size-3.5" /> Subir desde dispositivo
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('url')
                setError('')
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeMode === 'url'
                  ? 'bg-amber-950 text-white'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <LinkIcon className="size-3.5" /> Enlace URL
            </button>
          </div>

          <form onSubmit={handleAddImage} className="mt-4 space-y-3">
            {activeMode === 'file' ? (
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-950/20 bg-amber-50/50 p-5 transition hover:bg-amber-100/50">
                  <Upload className="size-8 text-amber-800 opacity-70" />
                  <span className="mt-2 text-sm font-semibold text-amber-950">
                    {selectedFile ? selectedFile.name : 'Haz clic para seleccionar una foto'}
                  </span>
                  <span className="text-xs text-gris-400">JPG, PNG o WEBP (máx. 5 MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {filePreview && (
                  <div className="mt-3 flex items-center gap-4 rounded-2xl border border-gris-100 p-2">
                    <img
                      src={filePreview}
                      alt="Vista previa"
                      className="size-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-amber-950">{selectedFile?.name}</p>
                      <p className="text-gris-400">
                        {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={INPUT}
                />
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-border-error bg-background-error px-4 py-2 text-xs text-error">
                {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" disabled={actionLoading}>
                <Plus className="size-4" />
                {actionLoading ? 'Guardando...' : 'Subir Imagen'}
              </Button>
            </div>
          </form>
        </div>

        {/* Galería de imágenes existentes */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-amber-950">
              Fotos registradas ({images.length})
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-amber-100/50" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-950/20 bg-white p-8 text-center">
              <p className="text-sm text-gris-700">
                Este lugar aún no tiene fotografías registradas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map((img) => {
                const src = resolveImageUrl(img.image_url)
                return (
                  <div
                    key={img.image_id}
                    className="group relative h-40 overflow-hidden rounded-2xl border border-gris-100 bg-amber-100 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`Foto de ${place.name}`}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100" />
                    <button
                      type="button"
                      title="Eliminar esta foto"
                      onClick={() => handleDeleteImage(img.image_id)}
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-error shadow-sm opacity-0 transition hover:bg-error hover:text-white group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-amber-950/10 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
