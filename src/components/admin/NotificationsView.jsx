import { useState } from 'react'
import {
  Send,
  Calendar,
  Home,
  Compass,
  MapPin,
  Target,
  Heart,
} from 'lucide-react'
import { useNotifications } from '@/hooks/admin/useNotifications'
import {
  NotificationHeader,
  NotificationComposer,
  NotificationMobilePreview,
  NotificationHistorySection,
} from './notifications'

const SCREENS = [
  { id: 'home', label: 'Inicio', icon: Home, desc: 'Pantalla principal de la app' },
  { id: 'places', label: 'Explorar Mapa', icon: Compass, desc: 'Mapa y catálogo de lugares' },
  { id: 'place', label: 'Lugar Específico', icon: MapPin, desc: 'Abre la ficha de un lugar' },
  { id: 'challenge', label: 'Retos e Insignias', icon: Target, desc: 'Lista de retos activos' },
  { id: 'favorites', label: 'Favoritos', icon: Heart, desc: 'Lugares guardados del usuario' },
]

const SUB_TABS = [
  { id: 'compose', label: 'Redactar y Enviar', icon: Send },
  { id: 'history', label: 'Historial', icon: Calendar },
]

export default function NotificationsView() {
  const [activeSubTab, setActiveSubTab] = useState('compose')
  const notifications = useNotifications()

  const selectedPlace = notifications.places.find(
    (p) => String(p.place_id) === String(notifications.selectedPlaceId)
  )

  return (
    <div className="space-y-8">
      {/* Encabezado con métricas estándar del admin */}
      <NotificationHeader
        stats={notifications.stats}
        loadingStats={notifications.loadingStats}
        loadingHistory={notifications.loadingHistory}
        onRefresh={notifications.refreshAll}
      />

      {/* Pestañas de navegación de la sección */}
      <div className="flex flex-wrap gap-2 border-b border-amber-950/10 pb-4">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeSubTab === tab.id
          const label =
            tab.id === 'history'
              ? `${tab.label} (${notifications.history.length})`
              : tab.label

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                active
                  ? 'bg-amber-950 text-white shadow-sm'
                  : 'border border-gris-100 bg-white text-amber-950 hover:bg-amber-100'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Pestaña 1: Componer y Previsualizar */}
      {activeSubTab === 'compose' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <NotificationComposer
              title={notifications.title}
              setTitle={notifications.setTitle}
              body={notifications.body}
              setBody={notifications.setBody}
              screen={notifications.screen}
              setScreen={notifications.setScreen}
              screens={SCREENS}
              places={notifications.places}
              selectedPlaceId={notifications.selectedPlaceId}
              setSelectedPlaceId={notifications.setSelectedPlaceId}
              targetType={notifications.targetType}
              setTargetType={notifications.setTargetType}
              selectedUserIds={notifications.selectedUserIds}
              toggleUserSelection={notifications.toggleUserSelection}
              selectAllFilteredUsers={notifications.selectAllFilteredUsers}
              clearSelectedUsers={notifications.clearSelectedUsers}
              userSearch={notifications.userSearch}
              setUserSearch={notifications.setUserSearch}
              filteredUsers={notifications.filteredUsers}
              fieldErrors={notifications.fieldErrors}
              alert={notifications.alert}
              onDismissAlert={() => notifications.setAlert(null)}
              sending={notifications.sending}
              onSubmit={notifications.handleSend}
            />
          </div>

          <div className="space-y-4 lg:col-span-5">
            <NotificationMobilePreview
              title={notifications.title}
              body={notifications.body}
              screen={notifications.screen}
              screens={SCREENS}
              selectedPlace={selectedPlace}
            />
          </div>
        </div>
      )}

      {/* Pestaña 2: Historial de Notificaciones */}
      {activeSubTab === 'history' && (
        <NotificationHistorySection
          history={notifications.history}
          screens={SCREENS}
          loadingHistory={notifications.loadingHistory}
          onRefresh={notifications.refreshAll}
        />
      )}
    </div>
  )
}
