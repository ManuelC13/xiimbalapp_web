import { useState, useEffect, useCallback } from 'react'
import { createChallenge, updateChallenge } from '@/api/challenges'

const EMPTY = {
  challenge_type: 'platform',
  badge_id: '',
  challenge_name: '',
  description: '',
  reward: '',
  requirements: '',
  status: 'active',
  start_date: '',
  end_date: '',
  target_count: 1,
  category_id: '',
  magical_town_id: '',
  place_id: '',
}

const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v))

export function useChallengeModal({ isOpen, challenge, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(challenge?.challenge_id)
  const isPlace = form.challenge_type === 'place'

  useEffect(() => {
    if (!isOpen) return
    setError('')
    if (challenge) {
      setForm({
        challenge_type: challenge.challenge_type,
        badge_id: challenge.badge_id ?? '',
        challenge_name: challenge.challenge_name || '',
        description: challenge.description || '',
        reward: challenge.reward || '',
        requirements: challenge.requirements || '',
        status: challenge.status || 'active',
        start_date: challenge.start_date || '',
        end_date: challenge.end_date || '',
        target_count: challenge.target_count ?? 1,
        category_id: challenge.category_id ?? '',
        magical_town_id: challenge.magical_town_id ?? '',
        place_id: challenge.place_id ?? '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [isOpen, challenge])

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault()

    if (!form.badge_id) return setError('Selecciona la insignia que otorgará el reto.')
    if (!form.challenge_name.trim()) return setError('El nombre del reto es obligatorio.')
    if (!form.description.trim()) return setError('La descripción del reto es obligatoria.')
    if (isPlace && !form.place_id) return setError('Selecciona el lugar del reto.')
    if (!isPlace) {
      const n = Number(form.target_count)
      if (!Number.isInteger(n) || n < 1 || n > 100) {
        return setError('La meta debe ser un número entero entre 1 y 100.')
      }
    }
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      return setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
    }

    const payload = {
      badge_id: Number(form.badge_id),
      challenge_name: form.challenge_name.trim(),
      description: form.description.trim(),
      // Los retos de plataforma solo otorgan insignia, sin recompensa adicional
      reward: isPlace ? form.reward.trim() || null : null,
      requirements: form.requirements.trim() || null,
      status: form.status,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    }

    if (isPlace) {
      payload.place_id = Number(form.place_id)
      payload.target_count = 1
    } else {
      payload.target_count = Number(form.target_count)
      payload.category_id = toNum(form.category_id)
      payload.magical_town_id = toNum(form.magical_town_id)
    }

    setLoading(true)
    setError('')
    try {
      let result
      if (isEditing) {
        result = await updateChallenge(challenge.challenge_id, payload)
      } else {
        // El código de verificación lo genera el backend automáticamente
        result = await createChallenge({ ...payload, challenge_type: form.challenge_type })
      }
      onSaved?.(result, isEditing)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Error al guardar el reto.')
    } finally {
      setLoading(false)
    }
  }, [form, isPlace, isEditing, challenge, onSaved, onClose])

  return { form, setField, loading, error, isEditing, isPlace, handleSubmit }
}