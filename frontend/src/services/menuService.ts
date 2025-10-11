import { apiService } from './api'
import { MenuItem } from '../../shared/types'

interface GetMenuParams {
  category?: string
  search?: string
}

interface GetMenuResponse {
  success: boolean
  menuItems: Record<string, MenuItem[]>
  categories: string[]
}

export const menuService = {
  async getRestaurantMenu(restaurantId: string, params: GetMenuParams = {}): Promise<GetMenuResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    return apiService.get<GetMenuResponse>(`/menu/restaurant/${restaurantId}?${queryParams.toString()}`)
  },

  async getMenuItem(id: string): Promise<{ success: boolean; menuItem: MenuItem }> {
    return apiService.get<{ success: boolean; menuItem: MenuItem }>(`/menu/item/${id}`)
  },

  async createMenuItem(data: Partial<MenuItem>): Promise<{ success: boolean; menuItem: MenuItem }> {
    return apiService.post<{ success: boolean; menuItem: MenuItem }>('/menu', data)
  },

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<{ success: boolean; menuItem: MenuItem }> {
    return apiService.put<{ success: boolean; menuItem: MenuItem }>(`/menu/${id}`, data)
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean; message: string }> {
    return apiService.delete<{ success: boolean; message: string }>(`/menu/${id}`)
  },

  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    return apiService.get<{ success: boolean; categories: string[] }>('/menu/categories')
  }
}