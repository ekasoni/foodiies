'use client';

import React from 'react';
import Link from 'next/link';
import { Food } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { StarIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/solid';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(food, 1);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Link href={`/foods/${food._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Food Image */}
        <div className="h-48 bg-gray-200 relative">
          {food.images && food.images.length > 0 ? (
            <img
              src={food.images[0]}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          {/* Rating Badge */}
          {food.rating > 0 && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-semibold">{food.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Dietary Icons */}
          <div className="absolute top-2 left-2 flex gap-1">
            {food.isVegetarian && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Veg
              </span>
            )}
            {food.isVegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Vegan
              </span>
            )}
            {food.isSpicy && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Spicy
              </span>
            )}
          </div>
        </div>

        {/* Food Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {food.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {food.description}
          </p>

          {/* Category and Cuisine */}
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {food.category}
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {food.cuisine}
            </span>
          </div>

          {/* Restaurant Info */}
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">{food.restaurant.name}</span>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(food.price)}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{food.preparationTime} min</span>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
              title="Add to cart"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
