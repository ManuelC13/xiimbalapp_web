import { X, Award, Upload, Link as LinkIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import { resolveImageUrl } from '@/api/client'
import { useBadgeModal } from '@/hooks/admin/useBadgeModal'

const INPUT =
  'h-12 w-full rounded-2xl border border-gris-100 bg-white px-4 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300'

export default function BadgeModal({ isOpen, badge = null, onClose, onSaved }) {
  const {
    name,
    setName,
    description,
    setDescription,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    removeIcon,
    setRemoveIcon,
    handleFileChange,
    loading,
    error,
    isEditing,
    handleSubmit,
  } = useBadgeModal({ isOpen, badge, onClose, onSaved })

  if (!isOpen) return null

  const existingImage = badge?.icon_url ? resolveImageUrl(badge.icon_url) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-amber-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-amber-50 p-6 shadow-2xl shadow-amber-950/20 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Award className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-amber-950">
              {isEditing ? 'Editar Insignia' : 'Nueva Insignia'}
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
            <label htmlFor="badge-name" className="text-sm font-semibold text-amber-950">
              Nombre de la insignia <span className="text-error">*</span>
            </label>
            <input
              id="badge-name"
              type="text"
              required
              maxLength={100}
              placeholder="Ej. Explorador de Izamal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="badge-description" className="text-sm font-semibold text-amber-950">
              Descripción <span className="text-error">*</span>
            </label>
            <textarea
              id="badge-description"
              required
              rows={3}
              placeholder="Describe cómo se obtiene o qué representa esta insignia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-2xl border border-gris-100 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Ícono: archivo físico o enlace URL */}
          <div className="space-y-2 rounded-2xl border border-gris-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-amber-950">
                Ícono <span className="font-normal text-gris-700">(opcional)</span>
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs cursor-pointer font-semibold transition ${
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
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs cursor-pointer font-semibold transition ${
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
                    {selectedFile ? selectedFile.name : 'Haz clic para seleccionar una imagen'}
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
                  <div className="flex items-center gap-3 rounded-xl border border-gris-100 bg-amber-50/30 p-2">
                    <img src={filePreview} alt="Vista previa" className="size-14 rounded-lg object-contain" />
                    <div className="text-xs">
                      <p className="font-semibold text-amber-950">{selectedFile?.name}</p>
                      <p className="text-gris-400">{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}

                {!filePreview && isEditing && existingImage && removeIcon && (
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-gris-100 bg-amber-50/30 p-3 text-xs">
                    <span className="text-amber-950">Se quitará el ícono al guardar.</span>
                    <button
                      type="button"
                      onClick={() => setRemoveIcon(false)}
                      className="font-semibold text-amber-800 underline cursor-pointer"
                    >
                      Deshacer
                    </button>
                  </div>
                )}

                {!filePreview && isEditing && existingImage && !removeIcon && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-2">
                      <p className="text-xs font-semibold text-amber-950">Ícono actual:</p>
                      <button
                        type="button"
                        onClick={() => setRemoveIcon(true)}
                        className="text-xs font-semibold text-error underline cursor-pointer"
                      >
                        Quitar ícono
                      </button>
                    </div>
                    <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-gris-100 bg-white">
                      <img
                        src={existingImage}
                        alt="Ícono actual"
                        className="h-full object-contain"
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
                  id="badge-icon"
                  type="url"
                  placeholder="https://ejemplo.com/insignia.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={INPUT}
                />
                {imageUrl.trim() && (
                  <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-gris-100 bg-white">
                    <img
                      src={imageUrl.trim()}
                      alt="Vista previa"
                      className="h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="-mt-2 text-xs text-gris-700">
            Si no agregas un ícono, la app mostrará uno por defecto.
          </p>

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
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Insignia'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}