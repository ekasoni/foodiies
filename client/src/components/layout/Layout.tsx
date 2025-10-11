import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  User,
  Heart,
  Plus,
  Menu,
  X,
  ChefHat,
  LogOut,
  Settings,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary-600 font-bold text-xl"
            >
              <ChefHat className="h-8 w-8" />
              <span>Foodies</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/recipes"
                className={`text-sm font-medium transition-colors ${
                  isActive('/recipes')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Browse Recipes
              </Link>
              
              {user && (
                <Link
                  to="/create-recipe"
                  className="flex items-center space-x-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Recipe</span>
                </Link>
              )}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Link
                      to="/favorites"
                      className={`p-2 rounded-lg transition-colors ${
                        isActive('/favorites')
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </Link>
                    
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName}
                        </span>
                      </button>

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="p-2">
                          <Link
                            to={`/profile/${user.username}`}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    {isMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Desktop Auth Links */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    {isMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>

              <Link
                to="/recipes"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600"
              >
                Browse Recipes
              </Link>

              {user ? (
                <>
                  <Link
                    to="/create-recipe"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Recipe</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-primary-500 text-white rounded-lg text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-primary-600 font-bold text-lg mb-4">
              <ChefHat className="h-6 w-6" />
              <span>Foodies</span>
            </div>
            <p className="text-gray-600 text-sm">
              Discover, share, and create amazing recipes with food lovers worldwide.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 Foodies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;