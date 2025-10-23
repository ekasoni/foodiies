import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RestaurantPage from './pages/RestaurantPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import RestaurantDashboard from './pages/RestaurantDashboard'
import NotFoundPage from './pages/NotFoundPage'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/menu/:restaurantId" element={<MenuPage />} />
          
          {/* Protected routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
              <RestaurantDashboard />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App