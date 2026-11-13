import { create } from 'zustand'
import * as authApi from '@/api/auth'
import { refreshSession, setSessionExpiredHandler } from '@/api/client'

export const isAdmin = (user) => user?.role_name?.toLowerCase() === 'admin'

// El access_token dura 15 min en el backend. Se renueva antes de que expire para que
// la cookie nunca desaparezca mientras el panel está abierto.
const KEEP_ALIVE_MS = 10 * 60 * 1000

let keepAliveTimer = null
let initPromise = null

export const useAuthStore = create((set, get) => {
  const stopKeepAlive = () => {
    clearInterval(keepAliveTimer)
    keepAliveTimer = null
  }

  const expireSession = () => {
    stopKeepAlive()
    if (get().user) set({ user: null, sessionExpired: true })
  }

  const renew = async () => {
    if (!get().user) return
    if (!(await refreshSession())) expireSession()
  }

  const startKeepAlive = () => {
    stopKeepAlive()
    keepAliveTimer = setInterval(renew, KEEP_ALIVE_MS)
  }

  // Los navegadores congelan los timers en pestañas inactivas: al volver, renovar.
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') renew()
    })
  }

  setSessionExpiredHandler(expireSession)

  const setSession = (user) => {
    set({ user, ready: true, sessionExpired: false })
    if (user) startKeepAlive()
    else stopKeepAlive()
  }

  return {
    user: null,
    ready: false,
    sessionExpired: false,

    init: () => {
      // Evita dobles llamadas (StrictMode) y que una respuesta tardía pise un login.
      initPromise ??= authApi
        .getMe()
        .then((user) => { if (!get().user) setSession(user) })
        .catch(() => { if (!get().user) setSession(null) })
      return initPromise
    },

    login: async (email, password) => {
      await authApi.login(email, password)

      // No confiar solo en el body del login: comprobar que la cookie quedó guardada
      // y que el backend realmente reconoce la sesión.
      let user
      try {
        user = await authApi.getMe()
      } catch {
        throw new Error(
          'Inicio de sesión correcto, pero el navegador no guardó la cookie de sesión. ' +
          'Revisa que no estén bloqueadas las cookies de este sitio (extensiones, modo privado o bloqueador).'
        )
      }

      setSession(user)
      return user
    },

    logout: async () => {
      stopKeepAlive()
      await authApi.logout().catch(() => {})
      set({ user: null, sessionExpired: false })
    },
  }
})
