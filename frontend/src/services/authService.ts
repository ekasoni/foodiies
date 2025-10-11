import { apiService } from './api'
import { User, LoginRequest, RegisterRequest } from '../../shared/types'

interface LoginResponse {
  success: boolean
  token: string
  user: User
}

interface RegisterResponse {
  success: boolean
  token: string
  user: User
}

interface MeResponse {
  success: boolean
  user: User
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', credentials)
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiService.post<RegisterResponse>('/auth/register', userData)
  },

  async getCurrentUser(): Promise<MeResponse> {
    return apiService.get<MeResponse>('/auth/me')
  },

  async refreshToken(): Promise<{ success: boolean; token: string }> {
    return apiService.post<{ success: boolean; token: string }>('/auth/refresh')
  },

  async logout(): Promise<void> {
    // In a real app, you might want to call a logout endpoint
    // to invalidate the token on the server
    return Promise.resolve()
  }
}