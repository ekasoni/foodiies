# 🍽️ Foodies - Full-Stack Food Delivery Application

A modern, full-stack food delivery application built with Next.js, Node.js, Express, and MongoDB. This application allows users to browse restaurants, order food, and manage their orders, while providing restaurant owners with tools to manage their menus and orders.

## ✨ Features

### For Customers
- 🔍 **Browse Restaurants**: Discover local restaurants with detailed information
- 🍕 **Food Discovery**: Browse and search through thousands of food items
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📱 **User Authentication**: Secure login and registration system
- 📍 **Order Tracking**: Track your orders from placement to delivery
- 💳 **Multiple Payment Methods**: Support for various payment options
- ⭐ **Reviews & Ratings**: Rate restaurants and food items
- 🔍 **Advanced Search**: Search by cuisine, price range, dietary preferences

### For Restaurant Owners
- 🏪 **Restaurant Management**: Create and manage restaurant profiles
- 📋 **Menu Management**: Add, edit, and organize food items
- 📊 **Order Management**: Track and manage incoming orders
- 📈 **Analytics Dashboard**: View sales and performance metrics
- ⏰ **Operating Hours**: Set restaurant operating hours
- 💰 **Pricing Control**: Manage food prices and delivery fees

### For Administrators
- 👥 **User Management**: Manage users and their roles
- 🏪 **Restaurant Approval**: Approve and manage restaurant listings
- 📊 **System Analytics**: View platform-wide statistics
- ⚙️ **System Configuration**: Manage platform settings

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client for API calls
- **React Context** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Multer** - File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodies-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodies
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
foodies-app/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # File uploads
│   └── server.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── lib/          # Utility functions
│   │   ├── types/        # TypeScript types
│   │   └── hooks/        # Custom hooks
│   └── public/           # Static assets
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (restaurant owners)
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `GET /api/restaurants/search/:query` - Search restaurants

### Foods
- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create food item (restaurant owners)
- `PUT /api/foods/:id` - Update food item
- `DELETE /api/foods/:id` - Delete food item
- `GET /api/foods/search/:query` - Search foods
- `GET /api/foods/restaurant/:restaurantId` - Get foods by restaurant

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/restaurant/:restaurantId` - Get restaurant orders

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role (admin)
- `PUT /api/users/:id/toggle-status` - Toggle user status (admin)

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Dark/Light Mode**: Toggle between themes (coming soon)
- **Accessibility**: WCAG compliant design
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and validation

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for API security
- **Rate Limiting**: API rate limiting (coming soon)
- **Data Sanitization**: Protection against XSS and injection attacks

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect GitHub repository
4. Deploy from main branch

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries and frameworks used
- Special thanks to the Next.js and Express.js communities
- Inspiration from popular food delivery apps

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@foodies.com
- Check our documentation at docs.foodies.com

---

**Made with ❤️ for food lovers everywhere**
