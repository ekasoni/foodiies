import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest, RegisterRequest } from '../../shared/types'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
          toast.success('Login successful!')
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.message || 'Login failed')
          throw error
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(userData)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
          toast.success('Registration successful!')
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.message || 'Registration failed')
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
        toast.success('Logged out successfully')
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const response = await authService.getCurrentUser()
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      updateUser: (user: User) => {
        set({ user })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)