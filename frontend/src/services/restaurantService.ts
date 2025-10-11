import { apiService } from './api'
import { RestaurantProfile, PaginatedResponse } from '../../shared/types'

interface GetRestaurantsParams {
  page?: number
  limit?: number
  search?: string
  cuisine?: string
  city?: string
  minRating?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface GetNearbyRestaurantsParams {
  latitude: number
  longitude: number
  radius?: number
}

export const restaurantService = {
  async getRestaurants(params: GetRestaurantsParams = {}): Promise<PaginatedResponse<RestaurantProfile>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    return apiService.get<PaginatedResponse<RestaurantProfile>>(`/restaurants?${queryParams.toString()}`)
  },

  async getRestaurant(id: string): Promise<{ success: boolean; restaurant: RestaurantProfile }> {
    return apiService.get<{ success: boolean; restaurant: RestaurantProfile }>(`/restaurants/${id}`)
  },

  async getNearbyRestaurants(params: GetNearbyRestaurantsParams): Promise<{ success: boolean; restaurants: RestaurantProfile[] }> {
    const queryParams = new URLSearchParams()
    queryParams.append('latitude', params.latitude.toString())
    queryParams.append('longitude', params.longitude.toString())
    if (params.radius) {
      queryParams.append('radius', params.radius.toString())
    }

    return apiService.get<{ success: boolean; restaurants: RestaurantProfile[] }>(`/restaurants/nearby?${queryParams.toString()}`)
  },

  async createRestaurant(data: Partial<RestaurantProfile>): Promise<{ success: boolean; restaurant: RestaurantProfile }> {
    return apiService.post<{ success: boolean; restaurant: RestaurantProfile }>('/restaurants', data)
  },

  async updateRestaurant(id: string, data: Partial<RestaurantProfile>): Promise<{ success: boolean; restaurant: RestaurantProfile }> {
    return apiService.put<{ success: boolean; restaurant: RestaurantProfile }>(`/restaurants/${id}`, data)
  }
}