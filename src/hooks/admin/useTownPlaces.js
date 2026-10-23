import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getPlaces, getCategories, deletePlace } from '@/api/places'
import { getMagicalTown, deleteMagicalTown } from '@/api/towns'

/**
 * Hook para la gestión de lugares de un pueblo mágico específico.
 * Centraliza carga de lugares, categorías, pueblo padre, búsquedas y eliminación.
 */
export function useTownPlaces({ propTown, onBack } = {}) {
  const { townId: paramTownId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [currentTown, setCurrentTown] = useState(
    propTown || location.state?.town || null
  )
  const [places, setPlaces] = useState([])
  const [categories, setCategories] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modales de eliminación de lugar
  const [placeToDelete, setPlaceToDelete] = useState(null)
  const [placeDeleteLoading, setPlaceDeleteLoading] = useState(false)

  // Modal de galería de imágenes
  const [galleryPlace, setGalleryPlace] = useState(null)

  // Modales del pueblo actual (editar y eliminar)
  const [townModalOpen, setTownModalOpen] = useState(false)
  const [townToDelete, setTownToDelete] = useState(null)
  const [townDeleteLoading, setTownDeleteLoading] = useState(false)

  const [error, setError] = useState('')

  const activeTownId = currentTown?.magical_town_id || (paramTownId ? parseInt(paramTownId, 10) : null)

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack()
    } else {
      navigate('/admin')
    }
  }, [navigate, onBack])

  // Si no tenemos el pueblo cargado (por ejemplo, al recargar la página), lo consultamos de la API
  useEffect(() => {
    if (!currentTown && activeTownId) {
      getMagicalTown(activeTownId)
        .then((data) => setCurrentTown(data))
        .catch(() => setError('No se pudo encontrar el pueblo mágico.'))
    }
  }, [activeTownId, currentTown])

  const loadData = useCallback(async () => {
    if (!activeTownId) return
    setLoading(true)
    setError('')
    try {
      const [placesData, catsData] = await Promise.all([
        getPlaces({ magical_town_id: activeTownId, only_active: false }),
        getCategories().catch(() => []),
      ])
      setPlaces(Array.isArray(placesData) ? placesData : [])
      const catMap = {}
      if (Array.isArray(catsData)) {
        catsData.forEach((c) => {
          if (c?.category_id) {
            catMap[c.category_id] = c.category_name
          }
        })
      }
      setCategories(catMap)
    } catch (err) {
      setError(err.message || 'Error al cargar los lugares.')
      setPlaces([])
    } finally {
      setLoading(false)
    }
  }, [activeTownId])

  useEffect(() => {
    if (propTown) {
      setCurrentTown(propTown)
    }
  }, [propTown])

  useEffect(() => {
    if (activeTownId) {
      loadData()
    }
  }, [activeTownId, loadData])

  // Manejo de navegación a creación y edición de lugares
  const handleOpenCreatePlace = useCallback(() => {
    navigate(`/admin/towns/${activeTownId}/places/new`, { state: { town: currentTown } })
  }, [navigate, activeTownId, currentTown])

  const handleOpenEditPlace = useCallback((place) => {
    navigate(`/admin/towns/${activeTownId}/places/${place.place_id}/edit`, {
      state: { town: currentTown, place },
    })
  }, [navigate, activeTownId, currentTown])

  const handleOpenDeletePlace = useCallback((place) => {
    setPlaceToDelete(place)
  }, [])

  const handleImagesUpdated = useCallback((placeId, updatedImages) => {
    setPlaces((prev) =>
      prev.map((p) => (p.place_id === placeId ? { ...p, images: updatedImages } : p))
    )
    setGalleryPlace((prev) => {
      if (prev?.place_id === placeId) {
        return { ...prev, images: updatedImages }
      }
      return prev
    })
  }, [])

  const handleConfirmDeletePlace = useCallback(async () => {
    if (!placeToDelete) return
    setPlaceDeleteLoading(true)
    try {
      await deletePlace(placeToDelete.place_id)
      setPlaces((prev) => prev.filter((p) => p.place_id !== placeToDelete.place_id))
      setPlaceToDelete(null)
    } catch (err) {
      alert(err.message || 'Error al eliminar el lugar.')
    } finally {
      setPlaceDeleteLoading(false)
    }
  }, [placeToDelete])

  // Manejo del pueblo actual
  const handleTownSaved = useCallback((updatedTown) => {
    setCurrentTown(updatedTown)
  }, [])

  const handleConfirmDeleteTown = useCallback(async () => {
    if (!townToDelete) return
    setTownDeleteLoading(true)
    try {
      await deleteMagicalTown(townToDelete.magical_town_id)
      setTownToDelete(null)
      handleBack()
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el pueblo mágico.')
    } finally {
      setTownDeleteLoading(false)
    }
  }, [townToDelete, handleBack])

  const placesList = useMemo(() => (Array.isArray(places) ? places : []), [places])

  const filteredPlaces = useMemo(() => {
    if (!search.trim()) return placesList
    const term = search.toLowerCase()
    return placesList.filter((p) => {
      return (
        p.name?.toLowerCase().includes(term) ||
        p.address?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      )
    })
  }, [placesList, search])

  return {
    currentTown,
    places,
    placesList,
    filteredPlaces,
    categories,
    loading,
    error,
    search,
    setSearch,
    placeToDelete,
    setPlaceToDelete,
    placeDeleteLoading,
    galleryPlace,
    setGalleryPlace,
    townModalOpen,
    setTownModalOpen,
    townToDelete,
    setTownToDelete,
    townDeleteLoading,
    handleBack,
    handleOpenCreatePlace,
    handleOpenEditPlace,
    handleOpenDeletePlace,
    handleImagesUpdated,
    handleConfirmDeletePlace,
    handleTownSaved,
    handleConfirmDeleteTown,
    loadData,
  }
}
