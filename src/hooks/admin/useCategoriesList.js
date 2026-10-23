import { useState, useEffect, useMemo, useCallback } from 'react'
import { getCategories, deleteCategory } from '@/api/categories'
import { getPlaceTypes } from '@/api/placeTypes'
import { getPlaces } from '@/api/places'

const normalize = (text = '') =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function useCategoriesList() {
  const [categories, setCategories] = useState([])
  const [placeTypes, setPlaceTypes] = useState([])
  const [placesCount, setPlacesCount] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | place_type_id

  // Modales
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [categoriesData, typesData, placesData] = await Promise.all([
        getCategories({ limit: 500 }),
        getPlaceTypes().catch(() => []),
        getPlaces({ limit: 500, only_active: false }).catch(() => []),
      ])

      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setPlaceTypes(Array.isArray(typesData) ? typesData : [])

      const counts = {}
      if (Array.isArray(placesData)) {
        placesData.forEach((place) => {
          ;(place?.category_ids || []).forEach((id) => {
            counts[id] = (counts[id] || 0) + 1
          })
        })
      }
      setPlacesCount(counts)
    } catch (err) {
      setError(err.message || 'Error al cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const typeNames = useMemo(
    () => Object.fromEntries(placeTypes.map((t) => [t.place_type_id, t.type_name])),
    [placeTypes]
  )

  const filteredCategories = useMemo(() => {
    const term = normalize(search)
    return categories.filter((cat) => {
      if (typeFilter !== 'all' && cat.place_type_id !== typeFilter) return false
      return !term || normalize(cat.category_name).includes(term)
    })
  }, [categories, search, typeFilter])

  // Categorías agrupadas por tipo de lugar, ordenadas alfabéticamente
  const groups = useMemo(() => {
    const byType = new Map()
    filteredCategories.forEach((cat) => {
      if (!byType.has(cat.place_type_id)) byType.set(cat.place_type_id, [])
      byType.get(cat.place_type_id).push(cat)
    })
    return [...byType.entries()]
      .map(([typeId, items]) => ({
        typeId,
        typeName: typeNames[typeId] || 'Sin tipo',
        items: items.sort((a, b) => a.category_name.localeCompare(b.category_name, 'es')),
      }))
      .sort((a, b) => a.typeName.localeCompare(b.typeName, 'es'))
  }, [filteredCategories, typeNames])

  const handleOpenCreate = useCallback(() => {
    setCategoryToEdit(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((category) => {
    setCategoryToEdit(category)
    setModalOpen(true)
  }, [])

  const handleOpenDelete = useCallback((category) => {
    setCategoryToDelete(category)
  }, [])

  const handleCategorySaved = useCallback((saved, isEditing) => {
    setCategories((prev) =>
      isEditing
        ? prev.map((c) => (c.category_id === saved.category_id ? saved : c))
        : [...prev, saved]
    )
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!categoryToDelete) return
    setDeleteLoading(true)
    try {
      await deleteCategory(categoryToDelete.category_id)
      setCategories((prev) => prev.filter((c) => c.category_id !== categoryToDelete.category_id))
      setCategoryToDelete(null)
    } catch (err) {
      setCategoryToDelete(null)
      setError(err.message || 'No se pudo eliminar la categoría.')
    } finally {
      setDeleteLoading(false)
    }
  }, [categoryToDelete])

  return {
    categories,
    placeTypes,
    placesCount,
    loading,
    error,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    groups,
    totalFiltered: filteredCategories.length,
    modalOpen,
    setModalOpen,
    categoryToEdit,
    categoryToDelete,
    setCategoryToDelete,
    deleteLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCategorySaved,
    handleConfirmDelete,
    loadData,
  }
}