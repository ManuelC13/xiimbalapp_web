import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAdminChallenges, deleteChallenge, regenerateChallengeCode } from '@/api/challenges'
import { getBadges } from '@/api/badges'
import { getPlaces, getCategories } from '@/api/places'
import { getMagicalTowns } from '@/api/towns'

export function useChallengesList() {
  const [challenges, setChallenges] = useState([])
  const [badges, setBadges] = useState([])
  const [places, setPlaces] = useState([])
  const [categories, setCategories] = useState([])
  const [towns, setTowns] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // newest | oldest
  const [typeFilter, setTypeFilter] = useState('all') // all | platform | place
  const [statusFilter, setStatusFilter] = useState('all') // all | active | inactive | postponed

  const [modalOpen, setModalOpen] = useState(false)
  const [challengeToEdit, setChallengeToEdit] = useState(null)
  const [challengeToDelete, setChallengeToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ch, bd, pl, ca, tw] = await Promise.all([
        getAdminChallenges(),
        getBadges({ limit: 500 }),
        getPlaces({ limit: 500, only_active: false }).catch(() => []),
        getCategories().catch(() => []),
        getMagicalTowns().catch(() => []),
      ])
      setChallenges(Array.isArray(ch) ? ch : [])
      setBadges(Array.isArray(bd) ? bd : [])
      setPlaces(Array.isArray(pl) ? pl : [])
      setCategories(Array.isArray(ca) ? ca : [])
      setTowns(Array.isArray(tw) ? tw : [])
    } catch (err) {
      setError(err.message || 'Error al cargar los retos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Diccionarios para resolver nombres rápidamente
  const badgesById = useMemo(() => Object.fromEntries(badges.map((b) => [b.badge_id, b])), [badges])
  const placesById = useMemo(() => Object.fromEntries(places.map((p) => [p.place_id, p])), [places])
  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.category_id, c])),
    [categories]
  )
  const townsById = useMemo(
    () => Object.fromEntries(towns.map((t) => [t.magical_town_id, t])),
    [towns]
  )

  const handleOpenCreate = useCallback(() => {
    setChallengeToEdit(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((e, challenge) => {
    if (e?.stopPropagation) e.stopPropagation()
    setChallengeToEdit(challenge)
    setModalOpen(true)
  }, [])

  const handleOpenDelete = useCallback((e, challenge) => {
    if (e?.stopPropagation) e.stopPropagation()
    setChallengeToDelete(challenge)
  }, [])

  const handleChallengeSaved = useCallback((saved, isEditing) => {
    if (isEditing) {
      setChallenges((prev) => prev.map((c) => (c.challenge_id === saved.challenge_id ? saved : c)))
    } else {
      setChallenges((prev) => [saved, ...prev])
    }
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!challengeToDelete) return
    setDeleteLoading(true)
    try {
      await deleteChallenge(challengeToDelete.challenge_id)
      setChallenges((prev) => prev.filter((c) => c.challenge_id !== challengeToDelete.challenge_id))
      setChallengeToDelete(null)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el reto.')
    } finally {
      setDeleteLoading(false)
    }
  }, [challengeToDelete])

  const handleRegenerateCode = useCallback(async (challenge) => {
    setRegeneratingId(challenge.challenge_id)
    try {
      const updated = await regenerateChallengeCode(challenge.challenge_id)
      setChallenges((prev) => prev.map((c) => (c.challenge_id === updated.challenge_id ? updated : c)))
    } catch (err) {
      alert(err.message || 'No se pudo regenerar el código.')
    } finally {
      setRegeneratingId(null)
    }
  }, [])

  const filteredChallenges = useMemo(() => {
    const term = search.trim().toLowerCase()
    const dir = sortOrder === 'oldest' ? 1 : -1
    const filtered = challenges.filter((c) => {
      if (typeFilter !== 'all' && c.challenge_type !== typeFilter) return false
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!term) return true
      return (
        c.challenge_name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        badgesById[c.badge_id]?.badge_name?.toLowerCase().includes(term)
      )
    })
    return filtered.sort((a, b) => (a.challenge_id - b.challenge_id) * dir)
  }, [challenges, search, sortOrder, typeFilter, statusFilter, badgesById])

  return {
    challenges,
    badges,
    places,
    categories,
    towns,
    badgesById,
    placesById,
    categoriesById,
    townsById,
    loading,
    error,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredChallenges,
    modalOpen,
    setModalOpen,
    challengeToEdit,
    challengeToDelete,
    setChallengeToDelete,
    deleteLoading,
    regeneratingId,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleChallengeSaved,
    handleConfirmDelete,
    handleRegenerateCode,
    loadData,
  }
}