import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, MenuItem } from '../../shared/types'

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  totalItems: number
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
}

interface CartActions {
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  updateSpecialInstructions: (menuItemId: string, instructions: string) => void
  clearCart: () => void
  setRestaurant: (restaurantId: string) => void
  calculateTotals: () => void
}

type CartStore = CartState & CartActions

const DELIVERY_FEE = 2.99
const TAX_RATE = 0.08

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      restaurantId: null,
      totalItems: 0,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,

      // Actions
      addItem: (menuItem: MenuItem, quantity = 1, specialInstructions = '') => {
        const { items, restaurantId } = get()
        
        // If cart is empty or different restaurant, clear and set new restaurant
        if (!restaurantId || restaurantId !== menuItem.restaurantId) {
          set({
            items: [],
            restaurantId: menuItem.restaurantId
          })
        }

        const existingItemIndex = items.findIndex(
          item => item.menuItem.id === menuItem.id
        )

        if (existingItemIndex > -1) {
          // Update existing item
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          updatedItems[existingItemIndex].specialInstructions = specialInstructions
          
          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem: CartItem = {
            menuItem,
            quantity,
            specialInstructions
          }
          
          set({ items: [...items, newItem] })
        }

        get().calculateTotals()
      },

      removeItem: (menuItemId: string) => {
        const { items } = get()
        const updatedItems = items.filter(item => item.menuItem.id !== menuItemId)
        
        set({ items: updatedItems })
        get().calculateTotals()
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId)
          return
        }

        const { items } = get()
        const updatedItems = items.map(item =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity }
            : item
        )
        
        set({ items: updatedItems })
        get().calculateTotals()
      },

      updateSpecialInstructions: (menuItemId: string, instructions: string) => {
        const { items } = get()
        const updatedItems = items.map(item =>
          item.menuItem.id === menuItemId
            ? { ...item, specialInstructions: instructions }
            : item
        )
        
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          totalItems: 0,
          subtotal: 0,
          deliveryFee: 0,
          tax: 0,
          total: 0
        })
      },

      setRestaurant: (restaurantId: string) => {
        set({ restaurantId })
      },

      calculateTotals: () => {
        const { items } = get()
        
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        const subtotal = items.reduce(
          (sum, item) => sum + (item.menuItem.price * item.quantity),
          0
        )
        const tax = subtotal * TAX_RATE
        const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0
        const total = subtotal + tax + deliveryFee

        set({
          totalItems,
          subtotal,
          tax,
          deliveryFee,
          total
        })
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId
      })
    }
  )
)