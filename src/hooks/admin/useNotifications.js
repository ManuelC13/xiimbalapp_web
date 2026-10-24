import { useState } from 'react'
import { useNotificationStats } from './useNotificationStats'
import { useNotificationComposer } from './useNotificationComposer'

export function useNotifications() {
  const [alert, setAlert] = useState(null) // { type: 'success' | 'error', message: '' }

  const statsHook = useNotificationStats()

  const composerHook = useNotificationComposer({
    onSentSuccess: (res) => {
      setAlert({
        type: 'success',
        message: `¡Notificación enviada exitosamente a ${res.target_count} dispositivo(s)!`,
      })
      statsHook.refreshAll()
    },
    onError: (msg) => {
      setAlert({ type: 'error', message: msg })
    },
  })

  return {
    stats: statsHook.stats,
    history: statsHook.history,
    loadingStats: statsHook.loadingStats,
    loadingHistory: statsHook.loadingHistory,
    refreshAll: statsHook.refreshAll,

    title: composerHook.title,
    setTitle: composerHook.setTitle,
    body: composerHook.body,
    setBody: composerHook.setBody,
    screen: composerHook.screen,
    setScreen: composerHook.setScreen,
    selectedPlaceId: composerHook.selectedPlaceId,
    setSelectedPlaceId: composerHook.setSelectedPlaceId,
    targetType: composerHook.targetType,
    setTargetType: composerHook.setTargetType,
    selectedUserIds: composerHook.selectedUserIds,
    toggleUserSelection: composerHook.toggleUserSelection,
    selectAllFilteredUsers: composerHook.selectAllFilteredUsers,
    clearSelectedUsers: composerHook.clearSelectedUsers,
    userSearch: composerHook.userSearch,
    setUserSearch: composerHook.setUserSearch,
    filteredUsers: composerHook.filteredUsers,
    fieldErrors: composerHook.fieldErrors,
    users: composerHook.users,
    places: composerHook.places,
    sending: composerHook.sending,
    handleSend: composerHook.handleSend,
    
    alert,
    setAlert,
  }
}
