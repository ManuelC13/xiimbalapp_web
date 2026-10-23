import { useState, useEffect, useCallback } from 'react'
import {
  createPlace,
  updatePlace,
  updatePlaceCategories,
  addPlaceImage,
  uploadPlaceImage,
  getCategories,
} from '@/api/places'

/**
 * Hook para el modal de creación y edición rápida de lugares turísticos.
 * Centraliza el formulario, categorías, modo de imagen (física/URL) y llamadas a la API.
 */
export function usePlaceModal({ isOpen, place = null, town, onClose, onSaved }) {
  const isEditing = Boolean(place?.place_id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [historicalInfo, setHistoricalInfo] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categories, setCategories] = useState([])

  // Modo de imagen: 'file' | 'url'
  const [imageMode, setImageMode] = useState('file')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then((data) => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]))

      if (place) {
        setName(place.name || '')
        setDescription(place.description || '')
        setAddress(place.address || '')
        setLatitude(place.latitude != null ? String(place.latitude) : '')
        setLongitude(place.longitude != null ? String(place.longitude) : '')
        setHistoricalInfo(place.historical_info || '')
        setIsActive(place.is_active ?? true)
        setSelectedCategories(Array.isArray(place.category_ids) ? place.category_ids : [])
      } else {
        setName('')
        setDescription('')
        setAddress('')
        setLatitude('')
        setLongitude('')
        setHistoricalInfo('')
        setIsActive(true)
        setSelectedCategories([])
      }
      setSelectedFile(null)
      setFilePreview('')
      setImageUrl('')
      setError('')
    }
  }, [isOpen, place])

  const toggleCategory = useCallback((categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }, [])

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

  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    if (!name.trim()) {
      setError('El nombre del lugar es obligatorio.')
      return
    }
    if (!description.trim()) {
      setError('La descripción del lugar es obligatoria.')
      return
    }
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (isNaN(lat) || isNaN(lng)) {
      setError('Debes ingresar coordenadas de latitud y longitud numéricas válidas.')
      return
    }

    setLoading(true)
    setError('')
    try {
      if (isEditing) {
        const updateData = {
          name: name.trim(),
          description: description.trim(),
          address: address.trim() || undefined,
          latitude: lat,
          longitude: lng,
          historical_info: historicalInfo.trim() || undefined,
          is_active: isActive,
        }

        let updated = await updatePlace(place.place_id, updateData)

        try {
          updated = await updatePlaceCategories(place.place_id, selectedCategories)
        } catch {
          // Continuar
        }

        // Subir o asociar imagen si se especificó
        if (imageMode === 'file' && selectedFile) {
          try {
            await uploadPlaceImage(place.place_id, selectedFile)
          } catch {
            // Continuar
          }
        } else if (imageMode === 'url' && imageUrl.trim()) {
          try {
            await addPlaceImage(place.place_id, imageUrl.trim())
          } catch {
            // Continuar
          }
        }

        if (onSaved) onSaved(updated, true)
      } else {
        const placeData = {
          name: name.trim(),
          description: description.trim(),
          address: address.trim() || undefined,
          latitude: lat,
          longitude: lng,
          historical_info: historicalInfo.trim() || undefined,
          magical_town_id: town?.magical_town_id,
          category_ids: selectedCategories,
        }

        const created = await createPlace(placeData)

        // Subir o asociar imagen
        if (imageMode === 'file' && selectedFile) {
          try {
            await uploadPlaceImage(created.place_id, selectedFile)
          } catch {
            // Continuar
          }
        } else if (imageMode === 'url' && imageUrl.trim()) {
          try {
            await addPlaceImage(created.place_id, imageUrl.trim())
          } catch {
            // Continuar
          }
        }

        if (onSaved) onSaved(created, false)
      }

      if (onClose) onClose()
    } catch (err) {
      setError(err.message || 'Error al guardar el lugar.')
    } finally {
      setLoading(false)
    }
  }, [
    name,
    description,
    latitude,
    longitude,
    address,
    historicalInfo,
    isActive,
    selectedCategories,
    imageMode,
    selectedFile,
    imageUrl,
    isEditing,
    place,
    town,
    onSaved,
    onClose,
  ])

  return {
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
  }
}
