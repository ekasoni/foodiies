import { Link } from 'react-router-dom'
import { HiHome, HiArrowLeft } from 'react-icons/hi'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <HiHome className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage