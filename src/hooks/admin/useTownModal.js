import { useState, useEffect, useCallback } from 'react'
import { createMagicalTown, updateMagicalTown } from '@/api/towns'
import { uploadImageFile } from '@/api/places'

/**
 * Hook para el modal de creación y edición de pueblos mágicos.
 * Gestiona el estado del formulario, validación, selección de imagen (física o URL)
 * y mutaciones a la API.
 */
export function useTownModal({ isOpen, town, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [imageMode, setImageMode] = useState('file') // 'file' | 'url'
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(town?.magical_town_id)

  useEffect(() => {
    if (isOpen) {
      setName(town?.name || '')
      setImageUrl(town?.image_url || '')
      setSelectedFile(null)
      setFilePreview('')
      // Si el pueblo ya tiene una imagen externa por URL, sugerir modo URL
      if (town?.image_url?.startsWith('http://') || town?.image_url?.startsWith('https://')) {
        setImageMode('url')
      } else {
        setImageMode('file')
      }
      setError('')
    }
  }, [isOpen, town])

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
      setError('El nombre del pueblo mágico es obligatorio.')
      return
    }

    setLoading(true)
    setError('')
    try {
      let finalImageUrl = undefined

      if (imageMode === 'file') {
        if (selectedFile) {
          const uploadRes = await uploadImageFile(selectedFile)
          finalImageUrl = uploadRes?.image_url
        } else if (isEditing && town?.image_url) {
          finalImageUrl = town.image_url
        }
      } else {
        finalImageUrl = imageUrl.trim() || undefined
      }

      const payload = {
        name: name.trim(),
        image_url: finalImageUrl,
      }

      let result
      if (isEditing) {
        result = await updateMagicalTown(town.magical_town_id, payload)
      } else {
        result = await createMagicalTown(payload)
      }

      if (onSaved) {
        onSaved(result, isEditing)
      }
      if (onClose) {
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Error al guardar el pueblo mágico.')
    } finally {
      setLoading(false)
    }
  }, [name, imageMode, selectedFile, imageUrl, isEditing, town, onSaved, onClose])

  return {
    name,
    setName,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    handleFileChange,
    loading,
    error,
    isEditing,
    handleSubmit,
  }
}
