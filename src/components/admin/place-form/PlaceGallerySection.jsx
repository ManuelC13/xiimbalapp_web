import { Image as ImageIcon, Eye, Trash2, Upload, Link as LinkIcon, Plus } from 'lucide-react'
import { resolveImageUrl } from '@/api/places'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function PlaceGallerySection({
  isEditing,
  existingImages,
  onPreview,
  onDeleteImage,
  imageMode,
  setImageMode,
  selectedFile,
  filePreview,
  onClearSelectedFile,
  onFileChange,
  imageUrl,
  setImageUrl,
  uploadingImage,
  onQuickAddImage,
}) {
  return (
    <section className="border-t border-amber-950/10 pt-8">
      <h2 className="text-xl font-bold text-amber-950">
        Fotografías ({existingImages.length})
      </h2>

      {/* Mosaico de fotos existentes */}
      {isEditing && (
        <div className="mt-6">
          {existingImages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-950/15 bg-amber-50 p-8 text-center">
              <ImageIcon className="mx-auto size-10 text-amber-950/30" />
              <p className="mt-2 text-sm font-bold text-amber-950">Aún no hay fotos registradas</p>
              <p className="text-xs text-gris-700">
                Sube una fotografía desde tu equipo o añade un enlace URL abajo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {existingImages.map((img, idx) => (
                <div
                  key={img.image_id}
                  className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-amber-100"
                >
                  <img
                    src={resolveImageUrl(img.image_url)}
                    alt={`Foto ${idx + 1}`}
                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />

                  {/* Badge de Portada */}
                  {idx === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-amber-950/90 px-2 py-0.5 text-[10px] font-bold text-amber-200 backdrop-blur">
                      Portada
                    </span>
                  )}

                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-amber-950/60 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      title="Ver en grande"
                      onClick={() => onPreview(resolveImageUrl(img.image_url))}
                      className="flex size-9 items-center justify-center rounded-full bg-white text-amber-950 shadow-md transition hover:scale-110"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar fotografía"
                      onClick={() => onDeleteImage(img.image_id)}
                      className="flex size-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:scale-110"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selector de subida de nueva imagen */}
      <div className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-amber-950">
            {isEditing ? 'Agregar fotografía' : 'Fotografía del lugar (opcional)'}
          </h3>

          {/* Pestañas de modo */}
          <div className="inline-flex rounded-full bg-amber-50 p-1">
            <button
              type="button"
              onClick={() => setImageMode('file')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                imageMode === 'file'
                  ? 'bg-amber-950 text-white shadow-sm'
                  : 'text-gris-700 hover:text-amber-950'
              }`}
            >
              <Upload className="size-3.5" />
              <span>Archivo</span>
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                imageMode === 'url'
                  ? 'bg-amber-950 text-white shadow-sm'
                  : 'text-gris-700 hover:text-amber-950'
              }`}
            >
              <LinkIcon className="size-3.5" />
              <span>URL Web</span>
            </button>
          </div>
        </div>

        {imageMode === 'file' ? (
          <div className="space-y-4">
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-amber-950/20 bg-amber-50 p-6 text-center transition hover:bg-amber-100/60">
              <div className="flex size-12 items-center justify-center rounded-full bg-white text-amber-950 shadow-sm">
                <Upload className="size-6" />
              </div>
              <span className="mt-3 text-sm font-bold text-amber-950">
                {selectedFile ? selectedFile.name : 'Haz clic para seleccionar imagen de tu dispositivo'}
              </span>
              <span className="mt-1 text-xs text-gris-400">
                Formatos soportados: JPG, PNG o WEBP (máximo 5 MB)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                className="hidden"
              />
            </label>

            {/* Previsualización del archivo */}
            {filePreview && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gris-100 p-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="size-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold text-amber-950">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-gris-400">
                      {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB • Listo para subir
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClearSelectedFile}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-gris-700 hover:bg-gris-100 hover:text-amber-950"
                  >
                    Quitar
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={onQuickAddImage}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-900 disabled:opacity-50"
                    >
                      <Upload className="size-3.5" />
                      {uploadingImage ? 'Subiendo...' : 'Subir a la galería'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                placeholder="https://ejemplo.com/fotografia.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={INPUT}
              />
              {isEditing && imageUrl.trim() && (
                <button
                  type="button"
                  onClick={onQuickAddImage}
                  disabled={uploadingImage}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-amber-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-900 disabled:opacity-50"
                >
                  <Plus className="size-4" />
                  {uploadingImage ? 'Guardando...' : 'Asociar foto'}
                </button>
              )}
            </div>

            {/* Previsualización de la URL */}
            {imageUrl.trim() && (
              <div className="overflow-hidden rounded-2xl border border-gris-100 p-3">
                <p className="mb-2 text-xs font-bold text-amber-950">Vista previa del enlace:</p>
                <div className="relative h-44 overflow-hidden rounded-xl bg-gris-100">
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
