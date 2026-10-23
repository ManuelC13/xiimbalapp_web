import { useState, useEffect, useMemo, useCallback } from 'react'
import { getBadges, getChallenges, deleteBadge } from '@/api/badges'

export function useBadgesList() {
  const [badges, setBadges] = useState([])
  const [challengesCount, setChallengesCount] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // newest | oldest
  const [error, setError] = useState('')

  // Modales
  const [modalOpen, setModalOpen] = useState(false)
  const [badgeToEdit, setBadgeToEdit] = useState(null)
  const [badgeToDelete, setBadgeToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadBadges = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [badgesData, challengesData] = await Promise.all([
        getBadges({ limit: 500 }),
        getChallenges().catch(() => []),
      ])

      setBadges(Array.isArray(badgesData) ? badgesData : [])

      const counts = {}
      if (Array.isArray(challengesData)) {
        challengesData.forEach((c) => {
          if (c?.badge_id) counts[c.badge_id] = (counts[c.badge_id] || 0) + 1
        })
      }
      setChallengesCount(counts)
    } catch (err) {
      setError(err.message || 'Error al cargar las insignias.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBadges()
  }, [loadBadges])

  const handleOpenCreate = useCallback(() => {
    setBadgeToEdit(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((e, badge) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
    setBadgeToEdit(badge)
    setModalOpen(true)
  }, [])

  const handleOpenDelete = useCallback((e, badge) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
    setBadgeToDelete(badge)
  }, [])

  const handleBadgeSaved = useCallback((savedBadge, isEditing) => {
    if (isEditing) {
      setBadges((prev) => prev.map((b) => (b.badge_id === savedBadge.badge_id ? savedBadge : b)))
    } else {
      setBadges((prev) => [...prev, savedBadge])
    }
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!badgeToDelete) return
    setDeleteLoading(true)
    try {
      await deleteBadge(badgeToDelete.badge_id)
      setBadges((prev) => prev.filter((b) => b.badge_id !== badgeToDelete.badge_id))
      setBadgeToDelete(null)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la insignia.')
    } finally {
      setDeleteLoading(false)
    }
  }, [badgeToDelete])

  const filteredBadges = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = term
      ? badges.filter(
          (b) => b.badge_name?.toLowerCase().includes(term) || b.description?.toLowerCase().includes(term)
        )
      : badges
    const dir = sortOrder === 'oldest' ? 1 : -1
    return [...filtered].sort((a, b) => (a.badge_id - b.badge_id) * dir)
  }, [badges, search, sortOrder])

  return {
    badges,
    challengesCount,
    loading,
    error,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    filteredBadges,
    modalOpen,
    setModalOpen,
    badgeToEdit,
    badgeToDelete,
    setBadgeToDelete,
    deleteLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleBadgeSaved,
    handleConfirmDelete,
    loadBadges,
  }
}