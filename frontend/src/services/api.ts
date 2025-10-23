import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-storage')
        if (token) {
          try {
            const parsedToken = JSON.parse(token)
            if (parsedToken.state?.token) {
              config.headers.Authorization = `Bearer ${parsedToken.state.token}`
            }
          } catch (error) {
            console.error('Error parsing auth token:', error)
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else if (error.message) {
          toast.error(error.message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config)
    return response.data
  }

  // File upload
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }

    const response = await this.api.post<T>(url, formData, config)
    return response.data
  }
}

export const apiService = new ApiService()