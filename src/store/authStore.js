import { create } from 'zustand'
import * as authApi from '@/api/auth'

export const isAdmin = (user) => user?.role_name?.toLowerCase() === 'admin'

export const useAuthStore = create((set) => ({
  user: null,
  ready: false,

  init: async () => {
    try {
      set({ user: await authApi.getMe(), ready: true })
    } catch {
      set({ user: null, ready: true })
    }
  },

  login: async (email, password) => {
    const user = await authApi.login(email, password)
    set({ user })
    return user
  },

  logout: async () => {
    await authApi.logout().catch(() => {})
    set({ user: null })
  },
}))
