import { X, MapPin, Upload, Link as LinkIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import { resolveImageUrl } from '@/api/client'
import { useTownModal } from '@/hooks/admin/useTownModal'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function TownModal({ isOpen, town = null, onClose, onSaved }) {
  const {
    name,
    setName,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    handleFileChange,
    loading,
    error,
    isEditing,
    handleSubmit,
  } = useTownModal({ isOpen, town, onClose, onSaved })

  if (!isOpen) return null

  const existingImage = town?.image_url ? resolveImageUrl(town.image_url) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <MapPin className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-amber-950">
              {isEditing ? 'Editar Pueblo Mágico' : 'Nuevo Pueblo Mágico'}
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
            <label htmlFor="town-name" className="text-sm font-semibold text-amber-950">
              Nombre del pueblo <span className="text-error">*</span>
            </label>
            <input
              id="town-name"
              type="text"
              required
              placeholder="Ej. Izamal, Valladolid, Sisal..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
            />
          </div>

          {/* Sección de Imagen: Archivo físico o Enlace URL */}
          <div className="space-y-2 rounded-2xl bg-white p-4 border border-gris-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-amber-950">
                Imagen de portada (opcional)
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
              <div className="mt-2 space-y-3">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-950/20 bg-amber-50/50 p-4 transition hover:bg-amber-100/50">
                  <Upload className="size-6 text-amber-800 opacity-70" />
                  <span className="mt-1 text-xs font-semibold text-amber-950">
                    {selectedFile
                      ? selectedFile.name
                      : 'Haz clic para seleccionar una foto de tu dispositivo'}
                  </span>
                  <span className="text-[11px] text-gris-400">JPG, PNG o WEBP (máx. 5 MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Previsualización del archivo seleccionado */}
                {filePreview && (
                  <div className="flex items-center gap-3 rounded-xl border border-gris-100 p-2 bg-amber-50/30">
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

                {/* Si no ha seleccionado archivo nuevo pero ya tenía imagen previa guardada */}
                {!filePreview && isEditing && existingImage && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-amber-950">Imagen actual:</p>
                    <div className="h-28 w-full overflow-hidden rounded-xl border border-gris-100 bg-white">
                      <img
                        src={existingImage}
                        alt="Imagen actual"
                        className="size-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                <input
                  id="town-image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={INPUT}
                />
                {imageUrl.trim() && (
                  <div className="h-32 w-full overflow-hidden rounded-xl border border-gris-100 bg-white">
                    <img
                      src={imageUrl.trim()}
                      alt="Vista previa"
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
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
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Pueblo Mágico'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
