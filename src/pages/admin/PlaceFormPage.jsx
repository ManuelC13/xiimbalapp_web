import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { usePlaceForm } from '@/hooks/admin/usePlaceForm'
import {
  PlaceFormHeader,
  PlaceGeneralInfoSection,
  PlaceLocationSection,
  PlaceGallerySection,
  PlaceSidebar,
  PlaceImageLightbox,
} from '@/components/admin/place-form'

export default function PlaceFormPage() {
  const {
    townId,
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
    <div className="space-y-8 pb-12">
      {/* Encabezado y navegación */}
      <PlaceFormHeader
        town={town}
        townId={townId}
        isEditing={isEditing}
        name={name}
        isActive={isActive}
        saving={saving}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {/* Alertas de error y éxito */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-border-error bg-background-error p-4 text-sm font-medium text-error shadow-sm">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Por favor verifica los siguientes detalles:</p>
            <p className="mt-0.5">{error}</p>
          </div>
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
        <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success-light p-4 text-sm font-semibold text-success shadow-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Contenedor del Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
          town={town}
        />

        {/* Botón submit invisible para permitir enviar formulario con Enter */}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>

      {/* Modal Lightbox para previsualizar foto en grande */}
      <PlaceImageLightbox
        imageUrl={previewModalUrl}
        onClose={() => setPreviewModalUrl(null)}
      />
    </div>
  )
}
