import { apiService } from './api'
import { Order, CreateOrderRequest, PaginatedResponse } from '../../shared/types'

interface GetOrdersParams {
  page?: number
  limit?: number
  status?: string
}

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<{ success: boolean; order: Order }> {
    return apiService.post<{ success: boolean; order: Order }>('/orders', data)
  },

  async getOrders(params: GetOrdersParams = {}): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    return apiService.get<PaginatedResponse<Order>>(`/orders?${queryParams.toString()}`)
  },

  async getOrder(id: string): Promise<{ success: boolean; order: Order }> {
    return apiService.get<{ success: boolean; order: Order }>(`/orders/${id}`)
  },

  async updateOrderStatus(id: string, status: string): Promise<{ success: boolean; order: Order }> {
    return apiService.put<{ success: boolean; order: Order }>(`/orders/${id}/status`, { status })
  },

  async getRestaurantOrders(restaurantId: string, params: GetOrdersParams = {}): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    return apiService.get<PaginatedResponse<Order>>(`/orders/restaurant/${restaurantId}?${queryParams.toString()}`)
  }
}