import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/landing/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import AdminPage from '@/pages/admin/AdminPage'
import { isAdmin, useAuthStore } from '@/store/authStore'

function AdminRoute({ children }) {
  const { user, ready } = useAuthStore()
  if (!ready) return null
  return isAdmin(user) ? children : <Navigate to="/login" replace />
}

export default function App() {
  const init = useAuthStore((state) => state.init)
  useEffect(() => { init() }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}