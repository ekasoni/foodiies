import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, Search, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary-500" />,
      title: 'Discover Recipes',
      description: 'Browse thousands of delicious recipes from around the world.',
    },
    {
      icon: <ChefHat className="h-8 w-8 text-primary-500" />,
      title: 'Share Your Creations',
      description: 'Upload your favorite recipes and share them with the community.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500" />,
      title: 'Join Community',
      description: 'Connect with fellow food lovers and learn new cooking techniques.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-500" />,
      title: 'Trending Dishes',
      description: 'Stay up-to-date with the latest food trends and popular recipes.',
    },
  ];

  const categories = [
    { name: 'Breakfast', image: '/api/placeholder/300/200', count: 150 },
    { name: 'Lunch', image: '/api/placeholder/300/200', count: 200 },
    { name: 'Dinner', image: '/api/placeholder/300/200', count: 300 },
    { name: 'Desserts', image: '/api/placeholder/300/200', count: 120 },
    { name: 'Snacks', image: '/api/placeholder/300/200', count: 80 },
    { name: 'Beverages', image: '/api/placeholder/300/200', count: 60 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ChefHat className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Foodies</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover amazing recipes, share your culinary creations, and connect with food lovers from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/recipes"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Recipes
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Foodies?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our growing community of food enthusiasts and discover what makes us special.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find recipes for every meal and occasion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/recipes?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group card overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} recipes</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Recipes Shared</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5K+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Happy Meals</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of food enthusiasts sharing their favorite recipes and discovering new flavors.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            <ChefHat className="h-5 w-5" />
            <span>Get Started Today</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;