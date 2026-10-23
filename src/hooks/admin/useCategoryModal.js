import { useState, useEffect, useCallback } from 'react'
import { createCategory, updateCategory } from '@/api/categories'

export function useCategoryModal({ isOpen, category, defaultPlaceTypeId, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [placeTypeId, setPlaceTypeId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(category?.category_id)

  useEffect(() => {
    if (isOpen) {
      setName(category?.category_name || '')
      setPlaceTypeId(String(category?.place_type_id ?? defaultPlaceTypeId ?? ''))
      setError('')
    }
  }, [isOpen, category, defaultPlaceTypeId])

  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio.')
      return
    }
    if (!placeTypeId) {
      setError('Selecciona el tipo de lugar al que pertenece la categoría.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = { category_name: name.trim(), place_type_id: Number(placeTypeId) }
      const result = isEditing
        ? await updateCategory(category.category_id, payload)
        : await createCategory(payload)

      onSaved?.(result, isEditing)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Error al guardar la categoría.')
    } finally {
      setLoading(false)
    }
  }, [name, placeTypeId, isEditing, category, onSaved, onClose])

  return {
    name,
    setName,
    placeTypeId,
    setPlaceTypeId,
    loading,
    error,
    isEditing,
    handleSubmit,
  }
}