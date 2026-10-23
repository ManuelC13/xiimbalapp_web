import { useState, useEffect, useCallback } from 'react'
import { getPlaceImages, addPlaceImage, uploadPlaceImage, deletePlaceImage } from '@/api/places'

/**
 * Hook para la gestión de la galería de fotos de un lugar turístico en el modal de galería.
 * Centraliza subida de imágenes locales o por URL, eliminación y sincronización.
 */
export function usePlaceGallery({ isOpen, place, onImagesUpdated }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMode, setActiveMode] = useState('file') // 'file' | 'url'
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const loadImages = useCallback(async () => {
    if (!place?.place_id) return
    setLoading(true)
    setError('')
    try {
      const data = await getPlaceImages(place.place_id)
      setImages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Error al cargar las fotos del lugar.')
    } finally {
      setLoading(false)
    }
  }, [place?.place_id])

  useEffect(() => {
    if (isOpen && place?.place_id) {
      loadImages()
      setSelectedFile(null)
      setFilePreview('')
      setImageUrl('')
      setError('')
    }
  }, [isOpen, place?.place_id, loadImages])

  const handleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5 MB.')
      return
    }

    setError('')
    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
  }, [])

  const handleAddImage = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setError('')
    setActionLoading(true)

    try {
      let createdImage
      if (activeMode === 'file') {
        if (!selectedFile) {
          setError('Selecciona un archivo de imagen desde tu dispositivo.')
          setActionLoading(false)
          return
        }
        createdImage = await uploadPlaceImage(place.place_id, selectedFile)
        setSelectedFile(null)
        setFilePreview('')
      } else {
        if (!imageUrl.trim()) {
          setError('Ingresa una URL de imagen válida.')
          setActionLoading(false)
          return
        }
        createdImage = await addPlaceImage(place.place_id, imageUrl.trim())
        setImageUrl('')
      }

      setImages((prev) => {
        const updated = [createdImage, ...prev]
        if (onImagesUpdated) {
          onImagesUpdated(place.place_id, updated)
        }
        return updated
      })
    } catch (err) {
      setError(err.message || 'Error al agregar la imagen.')
    } finally {
      setActionLoading(false)
    }
  }, [activeMode, selectedFile, imageUrl, place?.place_id, onImagesUpdated])

  const handleDeleteImage = useCallback(async (imageId) => {
    if (!window.confirm('¿Deseas eliminar esta fotografía del lugar?')) return

    try {
      await deletePlaceImage(imageId)
      setImages((prev) => {
        const updated = prev.filter((img) => img.image_id !== imageId)
        if (onImagesUpdated) {
          onImagesUpdated(place.place_id, updated)
        }
        return updated
      })
    } catch (err) {
      alert(err.message || 'Error al eliminar la imagen.')
    }
  }, [place?.place_id, onImagesUpdated])

  return {
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
    loadImages,
  }
}
