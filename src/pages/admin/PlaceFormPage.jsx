import { useState } from 'react'
import { AlertCircle, CheckCircle2, Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { usePlaceForm } from '@/hooks/admin/usePlaceForm'
import PlaceQrModal from '@/components/admin/PlaceQrModal'
import {
  PlaceFormHeader,
  PlaceGeneralInfoSection,
  PlaceLocationSection,
  PlaceGallerySection,
  PlaceSidebar,
  PlaceImageLightbox,
} from '@/components/admin/place-form'

export default function PlaceFormPage() {
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const {
    townId,
    placeId,
    isEditing,
    town,
    categories,
    loadingInitial,
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
    toggleCategory,
    existingImages,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    handleClearSelectedFile,
    imageUrl,
    setImageUrl,
    uploadingImage,
    previewModalUrl,
    setPreviewModalUrl,
    saving,
    error,
    setError,
    successMessage,
    mapsUrl,
    handleFileChange,
    handleQuickAddImage,
    handleDeleteImage,
    handleCancel,
    handleSubmit,
  } = usePlaceForm()

  if (loadingInitial) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-amber-100" />
        <div className="h-32 animate-pulse rounded-3xl bg-white/70" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-3xl bg-white/70 lg:col-span-2" />
          <div className="h-96 animate-pulse rounded-3xl bg-white/70 lg:col-span-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado y navegación */}
      <PlaceFormHeader
        town={town}
        townId={townId}
        isEditing={isEditing}
        name={name}
        isActive={isActive}
      />

      {/* Alertas de error y éxito */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          <AlertCircle className="size-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-error/70 hover:text-error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-success-light p-4 text-sm font-semibold text-success">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Contenedor del Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 rounded-3xl border border-amber-800/50 bg-white p-6 shadow-md shadow-amber-950/5 sm:p-8 lg:grid-cols-3"
      >
        {/* COLUMNA PRINCIPAL (2 COLUMNAS): Datos e Imágenes */}
        <div className="space-y-8 lg:col-span-2">
          {/* SECCIÓN 1: Información General */}
          <PlaceGeneralInfoSection
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            historicalInfo={historicalInfo}
            setHistoricalInfo={setHistoricalInfo}
          />

          {/* SECCIÓN 2: Ubicación y Coordenadas */}
          <PlaceLocationSection
            address={address}
            setAddress={setAddress}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            mapsUrl={mapsUrl}
          />

          {/* SECCIÓN 3: Galería Fotográfica */}
          <PlaceGallerySection
            isEditing={isEditing}
            existingImages={existingImages}
            onPreview={setPreviewModalUrl}
            onDeleteImage={handleDeleteImage}
            imageMode={imageMode}
            setImageMode={setImageMode}
            selectedFile={selectedFile}
            filePreview={filePreview}
            onClearSelectedFile={handleClearSelectedFile}
            onFileChange={handleFileChange}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            uploadingImage={uploadingImage}
            onQuickAddImage={handleQuickAddImage}
          />
        </div>

        {/* COLUMNA LATERAL (1 COLUMNA): Estado, Categorías y Atributos */}
        <PlaceSidebar
          isActive={isActive}
          setIsActive={setIsActive}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          isEditing={isEditing}
          onOpenQrModal={() => setQrModalOpen(true)}
        />

        {/* Acciones al pie del formulario */}
        <div className="flex items-center justify-end gap-3 border-t border-amber-950/10 pt-6 lg:col-span-3">
          <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            <Save className="size-4" />
            {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Lugar'}
          </Button>
        </div>
      </form>

      {/* Modal Lightbox para previsualizar foto en grande */}
      <PlaceImageLightbox
        imageUrl={previewModalUrl}
        onClose={() => setPreviewModalUrl(null)}
      />

      {/* Modal para ver, generar e imprimir código QR */}
      {isEditing && (
        <PlaceQrModal
          isOpen={qrModalOpen}
          place={{ place_id: Number(placeId), name }}
          townName={town?.name}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </div>
  )
}
