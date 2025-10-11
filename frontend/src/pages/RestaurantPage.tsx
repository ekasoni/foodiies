import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { restaurantService } from '../services/restaurantService'
import { HiStar, HiClock, HiLocationMarker, HiPhone } from 'react-icons/hi'

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: restaurant, isLoading, error } = useQuery(
    ['restaurant', id],
    () => restaurantService.getRestaurant(id!),
    {
      enabled: !!id
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !restaurant?.restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const { restaurant: restaurantData } = restaurant

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-800">
        {restaurantData.coverImage ? (
          <img
            src={restaurantData.coverImage}
            alt={restaurantData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurantData.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <HiStar className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-semibold">{restaurantData.rating.toFixed(1)}</span>
              <span className="text-gray-300 ml-1">({restaurantData.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <HiClock className="h-5 w-5 mr-1" />
              <span>30-45 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 mb-4">{restaurantData.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <HiLocationMarker className="h-5 w-5 mr-2" />
                  <span>{restaurantData.address}, {restaurantData.city}, {restaurantData.state}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <HiPhone className="h-5 w-5 mr-2" />
                  <span>{restaurantData.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours</h2>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>10:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Menu</h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Coming Soon</h3>
            <p className="text-gray-600">We're working on bringing you the full menu experience.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantPage