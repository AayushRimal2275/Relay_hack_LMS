import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const res = await authService.login(credentials)
          const { access, refresh, user } = res.data.data
          localStorage.setItem('access_token', access)
          localStorage.setItem('refresh_token', refresh)
          set({ token: access, user, loading: false })
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed'
          set({ loading: false, error: msg })
          return { success: false, error: msg }
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ token: null, user: null })
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
