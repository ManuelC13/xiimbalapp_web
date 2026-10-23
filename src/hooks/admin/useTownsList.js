import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMagicalTowns, deleteMagicalTown } from '@/api/towns'
import { getPlaces } from '@/api/places'

/**
 * Hook para la gestión de pueblos mágicos en la vista administrativa.
 * Centraliza la carga de datos, conteo de lugares, búsqueda y modales de edición/eliminación.
 */
export function useTownsList({ onSelectTown } = {}) {
  const navigate = useNavigate()

  const [towns, setTowns] = useState([])
  const [placesCount, setPlacesCount] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modales
  const [modalOpen, setModalOpen] = useState(false)
  const [townToEdit, setTownToEdit] = useState(null)
  const [townToDelete, setTownToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTowns = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [townsData, placesData] = await Promise.all([
        getMagicalTowns().catch(() => []),
        getPlaces({ limit: 500, only_active: false }).catch(() => []),
      ])

      const townsList = Array.isArray(townsData) ? townsData : []
      setTowns(townsList)

      const counts = {}
      if (Array.isArray(placesData)) {
        placesData.forEach((p) => {
          if (p?.magical_town_id) {
            counts[p.magical_town_id] = (counts[p.magical_town_id] || 0) + 1
          }
        })
      }
      setPlacesCount(counts)
    } catch (err) {
      setError(err.message || 'Error al cargar los pueblos mágicos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTowns()
  }, [loadTowns])

  const handleSelectTown = useCallback((town) => {
    if (onSelectTown) {
      onSelectTown(town)
    }
    navigate(`/admin/towns/${town.magical_town_id}`, { state: { town } })
  }, [navigate, onSelectTown])

  const handleOpenCreate = useCallback(() => {
    setTownToEdit(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((e, town) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
    setTownToEdit(town)
    setModalOpen(true)
  }, [])

  const handleOpenDelete = useCallback((e, town) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
    setTownToDelete(town)
  }, [])

  const handleTownSaved = useCallback((savedTown, isEditing) => {
    if (isEditing) {
      setTowns((prev) =>
        prev.map((t) => (t.magical_town_id === savedTown.magical_town_id ? savedTown : t))
      )
    } else {
      setTowns((prev) => [...prev, savedTown])
    }
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!townToDelete) return
    setDeleteLoading(true)
    try {
      await deleteMagicalTown(townToDelete.magical_town_id)
      setTowns((prev) => prev.filter((t) => t.magical_town_id !== townToDelete.magical_town_id))
      setTownToDelete(null)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el pueblo mágico.')
    } finally {
      setDeleteLoading(false)
    }
  }, [townToDelete])

  const filteredTowns = useMemo(() => {
    if (!search.trim()) return towns
    const term = search.toLowerCase()
    return towns.filter((t) => t.name?.toLowerCase().includes(term))
  }, [towns, search])

  return {
    towns,
    placesCount,
    loading,
    error,
    search,
    setSearch,
    filteredTowns,
    modalOpen,
    setModalOpen,
    townToEdit,
    townToDelete,
    setTownToDelete,
    deleteLoading,
    handleSelectTown,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleTownSaved,
    handleConfirmDelete,
    loadTowns,
  }
}
