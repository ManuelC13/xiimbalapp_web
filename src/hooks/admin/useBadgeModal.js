import { useState, useEffect, useCallback } from 'react'
import { createBadge, updateBadge } from '@/api/badges'
import { uploadImageFile } from '@/api/places'

export function useBadgeModal({ isOpen, badge, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageMode, setImageMode] = useState('file') // 'file' | 'url'
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [removeIcon, setRemoveIcon] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(badge?.badge_id)

  useEffect(() => {
    if (isOpen) {
      setName(badge?.badge_name || '')
      setDescription(badge?.description || '')
      setImageUrl(badge?.icon_url || '')
      setSelectedFile(null)
      setFilePreview('')
      setRemoveIcon(false)
      if (badge?.icon_url?.startsWith('http://') || badge?.icon_url?.startsWith('https://')) {
        setImageMode('url')
      } else {
        setImageMode('file')
      }
      setError('')
    }
  }, [isOpen, badge])

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

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
    setRemoveIcon(false)
    setFilePreview(URL.createObjectURL(file))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    if (!name.trim()) {
      setError('El nombre de la insignia es obligatorio.')
      return
    }
    if (!description.trim()) {
      setError('La descripción de la insignia es obligatoria.')
      return
    }

    setLoading(true)
    setError('')
    try {
      // El ícono es opcional: cadena vacía = sin imagen (la app usa uno por defecto)
      let finalIconUrl = ''

      if (imageMode === 'file') {
        if (selectedFile) {
          const uploadRes = await uploadImageFile(selectedFile)
          finalIconUrl = uploadRes?.image_url || ''
        } else if (isEditing && !removeIcon) {
          finalIconUrl = badge?.icon_url || ''
        }
      } else {
        finalIconUrl = imageUrl.trim()
      }

      const payload = {
        badge_name: name.trim(),
        description: description.trim(),
        icon_url: finalIconUrl,
      }

      const result = isEditing
        ? await updateBadge(badge.badge_id, payload)
        : await createBadge(payload)

      onSaved?.(result, isEditing)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Error al guardar la insignia.')
    } finally {
      setLoading(false)
    }
  }, [name, description, imageMode, selectedFile, imageUrl, removeIcon, isEditing, badge, onSaved, onClose])

  return {
    name,
    setName,
    description,
    setDescription,
    imageMode,
    setImageMode,
    selectedFile,
    filePreview,
    imageUrl,
    setImageUrl,
    removeIcon,
    setRemoveIcon,
    handleFileChange,
    loading,
    error,
    isEditing,
    handleSubmit,
  }
}