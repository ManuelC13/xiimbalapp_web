import { useState, useEffect, useCallback, useMemo } from 'react'
import { sendCustomNotification, getAdminUsers } from '@/api/notifications'
import { getPlaces } from '@/api/places'

export function useNotificationComposer({ onSentSuccess, onError } = {}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [screen, setScreen] = useState('home')
  const [selectedPlaceId, setSelectedPlaceId] = useState('')
  const [targetType, setTargetType] = useState('broadcast') // 'broadcast' | 'specific'
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [users, setUsers] = useState([])
  const [places, setPlaces] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [sending, setSending] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const data = await getAdminUsers({ limit: 500, only_active: true })
      setUsers(data || [])
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  const loadPlaces = useCallback(async () => {
    try {
      setLoadingPlaces(true)
      const data = await getPlaces({ only_active: true, limit: 300 })
      setPlaces(Array.isArray(data) ? data : data?.items || [])
    } catch (err) {
      console.error('Error al cargar lugares:', err)
    } finally {
      setLoadingPlaces(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
    loadPlaces()
  }, [loadUsers, loadPlaces])

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users.slice(0, 50)
    const q = userSearch.toLowerCase()
    return users.filter((u) => {
      const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase()
      const email = (u.email || '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [users, userSearch])

  const handleTitleChange = (val) => {
    setTitle(val)
    if (fieldErrors.title) {
      setFieldErrors((prev) => ({ ...prev, title: undefined }))
    }
  }

  const handleBodyChange = (val) => {
    setBody(val)
    if (fieldErrors.body) {
      setFieldErrors((prev) => ({ ...prev, body: undefined }))
    }
  }

  const handleScreenChange = (val) => {
    setScreen(val)
    if (val !== 'place' && fieldErrors.place) {
      setFieldErrors((prev) => ({ ...prev, place: undefined }))
    }
  }

  const handlePlaceChange = (val) => {
    setSelectedPlaceId(val)
    if (fieldErrors.place) {
      setFieldErrors((prev) => ({ ...prev, place: undefined }))
    }
  }

  const handleTargetTypeChange = (val) => {
    setTargetType(val)
    if (val === 'broadcast' && fieldErrors.audience) {
      setFieldErrors((prev) => ({ ...prev, audience: undefined }))
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
      if (updated.length > 0 && fieldErrors.audience) {
        setFieldErrors((f) => ({ ...f, audience: undefined }))
      }
      return updated
    })
  }

  const selectAllFilteredUsers = () => {
    const ids = filteredUsers.map((u) => u.user_id)
    setSelectedUserIds((prev) => {
      const updated = Array.from(new Set([...prev, ...ids]))
      if (updated.length > 0 && fieldErrors.audience) {
        setFieldErrors((f) => ({ ...f, audience: undefined }))
      }
      return updated
    })
  }

  const clearSelectedUsers = () => {
    setSelectedUserIds([])
  }

  const handleSend = async () => {
    const errors = {}
    if (!title.trim()) {
      errors.title = 'El título de la notificación es obligatorio.'
    }
    if (!body.trim()) {
      errors.body = 'El mensaje de la notificación es obligatorio.'
    }
    if (screen === 'place' && !selectedPlaceId) {
      errors.place = 'Debes seleccionar el lugar turístico de destino.'
    }
    if (targetType === 'specific' && selectedUserIds.length === 0) {
      errors.audience = 'Debes seleccionar al menos un usuario destinatario.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    try {
      setSending(true)
      const payload = {
        title: title.trim(),
        body: body.trim(),
        screen,
        data: screen === 'place' && selectedPlaceId ? { id: String(selectedPlaceId) } : {},
        user_ids: targetType === 'specific' ? selectedUserIds : null,
      }

      const res = await sendCustomNotification(payload)

      // Limpiar formulario tras envío exitoso
      setTitle('')
      setBody('')
      setScreen('home')
      setSelectedPlaceId('')
      setSelectedUserIds([])
      setTargetType('broadcast')
      setFieldErrors({})

      onSentSuccess?.(res)
    } catch (err) {
      onError?.(err.message || 'Error al enviar la notificación.')
    } finally {
      setSending(false)
    }
  }

  return {
    title,
    setTitle: handleTitleChange,
    body,
    setBody: handleBodyChange,
    screen,
    setScreen: handleScreenChange,
    selectedPlaceId,
    setSelectedPlaceId: handlePlaceChange,
    targetType,
    setTargetType: handleTargetTypeChange,
    selectedUserIds,
    toggleUserSelection,
    selectAllFilteredUsers,
    clearSelectedUsers,
    userSearch,
    setUserSearch,
    filteredUsers,
    fieldErrors,
    users,
    places,
    loadingUsers,
    loadingPlaces,
    sending,
    handleSend,
  }
}
