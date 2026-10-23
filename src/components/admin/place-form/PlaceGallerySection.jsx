import { Image as ImageIcon, Eye, Trash2, Upload, Link as LinkIcon, Plus } from 'lucide-react'
import { resolveImageUrl } from '@/api/places'

const INPUT =
  'h-12 w-full rounded-2xl border border-amber-950/15 bg-white px-4 text-base text-amber-950 placeholder:text-gris-400 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/50'

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
    <div className="rounded-3xl border border-amber-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between border-b border-amber-950/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-950">
            <ImageIcon className="size-5 text-amber-900" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950">
              Galería de Fotografías ({existingImages.length})
            </h2>
            <p className="text-xs text-gris-700">
              Imágenes visibles en el carrusel y ficha del lugar
            </p>
          </div>
        </div>
      </div>

      {/* Mosaico de fotos existentes */}
      {isEditing && (
        <div className="mt-6">
          {existingImages.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-950/15 bg-amber-50/40 p-8 text-center">
              <ImageIcon className="mx-auto size-10 text-amber-950/30" />
              <p className="mt-2 text-sm font-bold text-amber-950">Aún no hay fotos registradas</p>
              <p className="text-xs text-gris-700">
                Sube una fotografía desde tu equipo o añade un enlace URL abajo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {existingImages.map((img, idx) => (
                <div
                  key={img.image_id}
                  className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-amber-950/10 bg-amber-100 shadow-sm"
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
      <div className="mt-8 rounded-2xl border border-amber-950/10 bg-amber-50/40 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              {isEditing ? 'Agregar nueva fotografía' : 'Fotografía inicial de portada'}
            </h3>
            <p className="text-xs text-gris-700">
              {isEditing
                ? 'Puedes subir un archivo físico o pegar un enlace web directo.'
                : 'Esta imagen se registrará como la fotografía principal de este nuevo lugar.'}
            </p>
          </div>

          {/* Pestañas de modo */}
          <div className="inline-flex rounded-full bg-amber-200/60 p-1">
            <button
              type="button"
              onClick={() => setImageMode('file')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                imageMode === 'file'
                  ? 'bg-amber-950 text-white shadow-sm'
                  : 'text-amber-950 hover:bg-amber-100'
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
                  : 'text-amber-950 hover:bg-amber-100'
              }`}
            >
              <LinkIcon className="size-3.5" />
              <span>URL Web</span>
            </button>
          </div>
        </div>

        {imageMode === 'file' ? (
          <div className="space-y-4">
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-950/20 bg-white p-6 text-center transition hover:border-amber-600 hover:bg-amber-100/30">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-900 group-hover:bg-amber-200 transition">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-950/15 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="size-16 rounded-xl object-cover shrink-0 border border-amber-950/10"
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
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-gris-700 hover:text-amber-950 hover:bg-amber-100"
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
              <div className="overflow-hidden rounded-2xl border border-amber-950/15 bg-white p-3">
                <p className="mb-2 text-xs font-bold text-amber-950">Vista previa del enlace:</p>
                <div className="relative h-44 overflow-hidden rounded-xl bg-amber-100">
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
    </div>
  )
}
