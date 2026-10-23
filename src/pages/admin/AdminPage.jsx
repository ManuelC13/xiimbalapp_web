import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Award, MapPin, Target, Users } from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import TownsList from '@/components/admin/TownsList'
import TownPlacesView from '@/components/admin/TownPlacesView'
import PlaceFormPage from '@/pages/admin/PlaceFormPage'
import { useAuthStore } from '@/store/authStore'

const TABS = [
  { id: 'towns', label: 'Pueblos y Lugares', icon: MapPin },
  { id: 'challenges', label: 'Retos', icon: Target, disabled: true },
  { id: 'badges', label: 'Insignias', icon: Award, disabled: true },
  { id: 'users', label: 'Usuarios', icon: Users, disabled: true },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('towns')

  const isInsideTown = location.pathname.includes('/towns/')

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <AdminNavbar user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-8xl space-y-8 px-6 pb-16 pt-32 lg:px-15">
        {/* Pestañas de navegación del panel (solo visibles en la vista principal) */}
        {!isInsideTown && (
          <div className="flex flex-wrap gap-2 border-b border-amber-950/10 pb-4">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={tab.disabled}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-amber-950 text-white shadow-sm'
                      : tab.disabled
                        ? 'cursor-not-allowed text-gris-400 opacity-60'
                        : 'text-amber-950 hover:bg-amber-100'
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                  {tab.disabled && (
                    <span className="rounded-full bg-gris-100 px-2 py-0.5 text-[10px] text-gris-700">
                      Pronto
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Rutas internas del panel de administración */}
        <Routes>
          <Route index element={<TownsList />} />
          <Route path="towns/:townId" element={<TownPlacesView />} />
          <Route path="towns/:townId/places/new" element={<PlaceFormPage />} />
          <Route path="towns/:townId/places/:placeId/edit" element={<PlaceFormPage />} />
        </Routes>
      </main>
    </div>
  )
}
