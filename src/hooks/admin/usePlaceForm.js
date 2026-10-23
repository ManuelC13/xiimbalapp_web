import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  getPlace,
  createPlace,
  updatePlace,
  updatePlaceCategories,
  getPlaceImages,
  addPlaceImage,
  uploadPlaceImage,
  deletePlaceImage,
  getCategories,
} from '@/api/places'
import { getMagicalTown } from '@/api/towns'

/**
 * Hook para la página de creación y edición completa de un lugar turístico.
 * Administra datos iniciales, sincronización con el servidor, campos de texto,
 * coordenadas, imágenes, estados de carga y navegación.
 */
export function usePlaceForm() {
  const { townId, placeId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const isEditing = Boolean(placeId)

  const [town, setTown] = useState(location.state?.town || null)
  const [categories, setCategories] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  // Datos del formulario
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [historicalInfo, setHistoricalInfo] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState([])

  // Fotos
  const [existingImages, setExistingImages] = useState([])
  const [imageMode, setImageMode] = useState('file') // 'file' | 'url'
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewModalUrl, setPreviewModalUrl] = useState(null)

  // Estados de guardado y feedback
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setLoadingInitial(true)
      try {
        const promises = [
          getCategories().catch(() => []),
          town ? Promise.resolve(town) : getMagicalTown(townId).catch(() => null),
        ]

        if (isEditing) {
          promises.push(getPlace(placeId))
          promises.push(getPlaceImages(placeId).catch(() => []))
        }

        const [cats, townData, placeData, imagesData] = await Promise.all(promises)

        if (!isMounted) return

        setCategories(Array.isArray(cats) ? cats : [])
        if (townData) setTown(townData)

        if (isEditing && placeData) {
          setName(placeData.name || '')
          setDescription(placeData.description || '')
          setAddress(placeData.address || '')
          setLatitude(placeData.latitude != null ? String(placeData.latitude) : '')
          setLongitude(placeData.longitude != null ? String(placeData.longitude) : '')
          setHistoricalInfo(placeData.historical_info || '')
          setIsActive(placeData.is_active ?? true)
          setSelectedCategories(Array.isArray(placeData.category_ids) ? placeData.category_ids : [])
          setExistingImages(Array.isArray(imagesData) ? imagesData : placeData.images || [])
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Error al cargar los datos del lugar.')
      } finally {
        if (isMounted) setLoadingInitial(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [townId, placeId, isEditing])

  const toggleCategory = useCallback((catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }, [])

  const handleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido (JPG, PNG o WEBP).')
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

  const handleClearSelectedFile = useCallback(() => {
    setSelectedFile(null)
    setFilePreview('')
  }, [])

  // Subir foto individual inmediatamente en modo edición
  const handleQuickAddImage = useCallback(async () => {
    setError('')
    setUploadingImage(true)
    try {
      let newImage
      if (imageMode === 'file') {
        if (!selectedFile) {
          setError('Selecciona una imagen de tu dispositivo antes de subirla.')
          setUploadingImage(false)
          return
        }
        newImage = await uploadPlaceImage(placeId, selectedFile)
        setSelectedFile(null)
        setFilePreview('')
      } else {
        if (!imageUrl.trim()) {
          setError('Ingresa una URL de imagen válida.')
          setUploadingImage(false)
          return
        }
        newImage = await addPlaceImage(placeId, imageUrl.trim())
        setImageUrl('')
      }
      setExistingImages((prev) => [newImage, ...prev])
      setSuccessMessage('Fotografía agregada a la galería.')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al subir la fotografía.')
    } finally {
      setUploadingImage(false)
    }
  }, [imageMode, selectedFile, imageUrl, placeId])

  const handleDeleteImage = useCallback(async (imageId) => {
    if (!window.confirm('¿Deseas eliminar esta fotografía del lugar?')) return
    try {
      await deletePlaceImage(imageId)
      setExistingImages((prev) => prev.filter((img) => img.image_id !== imageId))
      setSuccessMessage('Foto eliminada.')
      setTimeout(() => setSuccessMessage(''), 2000)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la fotografía.')
    }
  }, [])

  const handleCancel = useCallback(() => {
    navigate(`/admin/towns/${townId}`, { state: { town } })
  }, [navigate, townId, town])

  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    if (!name.trim()) {
      setError('El nombre del lugar es obligatorio.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!description.trim()) {
      setError('La descripción del lugar es obligatoria.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (isNaN(lat) || isNaN(lng)) {
      setError('Ingresa coordenadas numéricas válidas de latitud y longitud.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)
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

        await updatePlace(placeId, updateData)

        try {
          await updatePlaceCategories(placeId, selectedCategories)
        } catch {
          // Continuar
        }

        // Si quedó alguna imagen seleccionada sin subir antes de guardar
        if (imageMode === 'file' && selectedFile) {
          try {
            await uploadPlaceImage(placeId, selectedFile)
          } catch {
            // Continuar
          }
        } else if (imageMode === 'url' && imageUrl.trim()) {
          try {
            await addPlaceImage(placeId, imageUrl.trim())
          } catch {
            // Continuar
          }
        }

        navigate(`/admin/towns/${townId}`, { replace: true, state: { town } })
      } else {
        const createData = {
          name: name.trim(),
          description: description.trim(),
          address: address.trim() || undefined,
          latitude: lat,
          longitude: lng,
          historical_info: historicalInfo.trim() || undefined,
          magical_town_id: parseInt(townId, 10),
          category_ids: selectedCategories,
        }

        const created = await createPlace(createData)

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

        navigate(`/admin/towns/${townId}`, { replace: true, state: { town } })
      }
    } catch (err) {
      setError(err.message || 'Error al guardar los datos del lugar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
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
    isEditing,
    imageMode,
    selectedFile,
    imageUrl,
    townId,
    placeId,
    town,
    navigate,
  ])

  const hasValidCoords = useMemo(() => {
    return !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))
  }, [latitude, longitude])

  const mapsUrl = useMemo(() => {
    return hasValidCoords ? `https://www.google.com/maps?q=${latitude},${longitude}` : null
  }, [hasValidCoords, latitude, longitude])

  return {
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
    hasValidCoords,
    mapsUrl,
    handleFileChange,
    handleQuickAddImage,
    handleDeleteImage,
    handleCancel,
    handleSubmit,
  }
}
