export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  customerProfile?: CustomerProfile;
  restaurantProfile?: RestaurantProfile;
  addresses?: Address[];
}

export interface CustomerProfile {
  id: string;
  userId: string;
  avatar?: string;
  preferences?: any;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  openingHours?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  restaurant?: RestaurantProfile;
  reviews?: Review[];
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: any;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  restaurant: RestaurantProfile;
  customer?: User;
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  createdAt: string;
  menuItem: MenuItem;
}

export interface Payment {
  id: string;
  orderId: string;
  stripePaymentIntentId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  restaurantId?: string;
  menuItemId?: string;
  orderId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  customer: User;
  restaurant?: RestaurantProfile;
  menuItem?: MenuItem;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'RESTAURANT';
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  deliveryAddress: any;
  specialInstructions?: string;
}