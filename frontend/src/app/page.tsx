'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import RestaurantCard from '@/components/RestaurantCard';
import FoodCard from '@/components/FoodCard';
import { Restaurant, Food } from '@/types';
import api from '@/lib/api';
import { StarIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredFoods, setFeaturedFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, foodsRes] = await Promise.all([
          api.get('/restaurants?limit=6'),
          api.get('/foods?limit=8')
        ]);
        
        setRestaurants(restaurantsRes.data.restaurants);
        setFeaturedFoods(foodsRes.data.foods);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Food
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Order from your favorite restaurants and get it delivered to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/restaurants"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Restaurants
              </a>
              <a
                href="/search"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Search Food
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Foodies?
            </h2>
            <p className="text-lg text-gray-600">
              We make food delivery simple, fast, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered in 30 minutes or less
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Food</h3>
              <p className="text-gray-600">
                Only the best restaurants and highest quality food
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Service</h3>
              <p className="text-gray-600">
                Order anytime, anywhere with our 24/7 service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Restaurants</h2>
            <a
              href="/restaurants"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              View All →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Dishes</h2>
            <a
              href="/foods"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              View All →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of satisfied customers and start ordering today
          </p>
          <a
            href="/register"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </Layout>
  );
}
