import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { HiSearch, HiStar, HiClock, HiTruck } from 'react-icons/hi'
import { restaurantService } from '../services/restaurantService'
import { RestaurantProfile } from '../../shared/types'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const { data: restaurants, isLoading } = useQuery(
    ['restaurants', searchQuery, location],
    () => restaurantService.getRestaurants({
      search: searchQuery,
      city: location,
      limit: 6
    }),
    {
      keepPreviousData: true
    }
  )

  const features = [
    {
      icon: <HiSearch className="h-8 w-8 text-primary-600" />,
      title: 'Find Restaurants',
      description: 'Discover amazing restaurants near you with our smart search'
    },
    {
      icon: <HiClock className="h-8 w-8 text-primary-600" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: <HiStar className="h-8 w-8 text-primary-600" />,
      title: 'Quality Food',
      description: 'Only the best restaurants and highest quality food'
    },
    {
      icon: <HiTruck className="h-8 w-8 text-primary-600" />,
      title: 'Track Orders',
      description: 'Real-time tracking of your order from kitchen to door'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Your Favorite Food,{' '}
              <span className="text-yellow-300">Delivered Fast</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Discover amazing restaurants and order delicious meals with just a few clicks
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for restaurants or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                </div>
                <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                  Search
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Foodies?
            </h2>
            <p className="text-xl text-gray-600">
              We make food delivery simple, fast, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Restaurants
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most loved restaurants in your area
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants?.data?.map((restaurant: RestaurantProfile, index: number) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {restaurant.coverImage ? (
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-4xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                      <HiStar className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {restaurant.city}, {restaurant.state}
                      </span>
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/restaurants"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers and start ordering today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/restaurants"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage