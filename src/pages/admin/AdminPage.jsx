import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Award, MapPin, Target, Users, Tag } from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import TownsList from '@/components/admin/TownsList'
import TownPlacesView from '@/components/admin/TownPlacesView'
import BadgesList from '@/components/admin/BadgesList'
import ChallengesList from '@/components/admin/ChallengesList'
import CategoriesList from '@/components/admin/CategoriesList'
import PlaceFormPage from '@/pages/admin/PlaceFormPage'
import { useAuthStore } from '@/store/authStore'

const TABS = [
  { id: 'towns', label: 'Pueblos y Lugares', icon: MapPin, path: '/admin' },
  { id: 'challenges', label: 'Retos', icon: Target, path: '/admin/challenges' },
  { id: 'badges', label: 'Insignias', icon: Award, path: '/admin/badges' },
  { id: 'categories', label: 'Categorías', icon: Tag, path: '/admin/categories' },
  { id: 'users', label: 'Usuarios', icon: Users, disabled: true },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isInsideTown = location.pathname.includes('/towns/')
  const activeTab = location.pathname.startsWith('/admin/badges')
    ? 'badges'
    : location.pathname.startsWith('/admin/challenges')
      ? 'challenges'
      : location.pathname.startsWith('/admin/categories')
        ? 'categories'
        : 'towns'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
                  onClick={() => navigate(tab.path)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-amber-950 text-white shadow-sm cursor-pointer'
                      : tab.disabled
                        ? 'cursor-not-allowed text-gris-400 opacity-60'
                        : 'text-amber-950 hover:bg-amber-100 cursor-pointer'
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
          <Route path="badges" element={<BadgesList />} />
          <Route path="challenges" element={<ChallengesList />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="towns/:townId" element={<TownPlacesView />} />
          <Route path="towns/:townId/places/new" element={<PlaceFormPage />} />
          <Route path="towns/:townId/places/:placeId/edit" element={<PlaceFormPage />} />
        </Routes>
      </main>
    </div>
  )
}
