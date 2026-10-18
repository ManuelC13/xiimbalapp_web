import { MapPin } from 'lucide-react'
import { useEffect } from 'react'
import { apiRequest } from '@/api/client'

export default function App() {
  useEffect(() => {
    apiRequest('/api/auth/me').catch((e) => console.log('Respuesta del backend:', e.message))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center gap-2 bg-amber-50 text-amber-950">
      <MapPin className="size-6 text-amber-600" />
      <h1 className="text-2xl font-bold">XíimbalApp Web</h1>
    </div>
  )
}