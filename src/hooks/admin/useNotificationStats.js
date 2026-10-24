import { useState, useEffect, useCallback } from 'react'
import { getNotificationStats, getNotificationHistory } from '@/api/notifications'

export function useNotificationStats() {
  const [stats, setStats] = useState({
    total_devices: 0,
    total_users_with_devices: 0,
    total_users: 0,
    android_count: 0,
    ios_count: 0,
  })
  const [history, setHistory] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true)
      const data = await getNotificationStats()
      setStats(data)
    } catch (err) {
      console.error('Error al cargar métricas de notificaciones:', err)
    } finally {
      setLoadingStats(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      setLoadingHistory(true)
      const data = await getNotificationHistory(50)
      setHistory(data || [])
    } catch (err) {
      console.error('Error al cargar historial de notificaciones:', err)
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
    loadHistory()
  }, [loadStats, loadHistory])

  const refreshAll = useCallback(() => {
    loadStats()
    loadHistory()
  }, [loadStats, loadHistory])

  return {
    stats,
    history,
    loadingStats,
    loadingHistory,
    loadStats,
    loadHistory,
    refreshAll,
  }
}
