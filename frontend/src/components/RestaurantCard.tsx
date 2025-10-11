'use client';

import React from 'react';
import Link from 'next/link';
import { Restaurant } from '@/types';
import { StarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const formatPriceRange = (priceRange: string) => {
    return priceRange;
  };

  const formatAddress = (address: Restaurant['address']) => {
    return `${address.city}, ${address.state}`;
  };

  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Restaurant Image */}
        <div className="h-48 bg-gray-200 relative">
          {restaurant.images && restaurant.images.length > 0 ? (
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {restaurant.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.cuisine.slice(0, 2).map((cuisine, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
              >
                {cuisine}
              </span>
            ))}
            {restaurant.cuisine.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{restaurant.cuisine.length - 2} more
              </span>
            )}
          </div>

          {/* Restaurant Details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span className="truncate">{formatAddress(restaurant.address)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{restaurant.estimatedDeliveryTime} min</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-900">
                  {formatPriceRange(restaurant.priceRange)}
                </span>
                {restaurant.deliveryFee > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +${restaurant.deliveryFee} delivery
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
