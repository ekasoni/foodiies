# 🍽️ Foodies - Full-Stack Food Delivery Application

A modern, full-stack food delivery application built with React, Node.js, and PostgreSQL. Foodies connects hungry customers with local restaurants, offering a seamless ordering experience with real-time updates and secure payments.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure signup/login with JWT tokens
- **Restaurant Discovery**: Browse restaurants by cuisine, location, and ratings
- **Menu Browsing**: View detailed menus with images, descriptions, and prices
- **Shopping Cart**: Add/remove items, modify quantities, apply discounts
- **Order Management**: Track orders in real-time with status updates
- **Payment Processing**: Secure payment integration with Stripe
- **Reviews & Ratings**: Rate restaurants and dishes, read reviews
- **Favorites**: Save favorite restaurants and dishes
- **Order History**: View past orders and reorder easily

### Restaurant Features
- **Restaurant Dashboard**: Manage menu, orders, and analytics
- **Menu Management**: Add/edit/delete dishes with images and descriptions
- **Order Processing**: Accept/decline orders, update order status
- **Analytics**: View sales reports and customer insights
- **Profile Management**: Update restaurant information and hours

### Admin Features
- **User Management**: Manage customers and restaurants
- **Restaurant Approval**: Approve/reject restaurant applications
- **Analytics Dashboard**: Platform-wide statistics and insights
- **Content Moderation**: Manage reviews and reported content

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for state management and caching
- **React Hook Form** for form handling
- **Zustand** for global state management
- **Socket.io-client** for real-time updates

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Socket.io** for real-time communication
- **Stripe** for payment processing
- **Nodemailer** for email notifications

### DevOps & Tools
- **Docker** for containerization
- **ESLint** & **Prettier** for code quality
- **Jest** for testing
- **GitHub Actions** for CI/CD

## 📁 Project Structure

```
foodies/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── store/          # Zustand store
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── shared/                  # Shared types and utilities
├── docker-compose.yml      # Docker configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodies
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database and API keys
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URL
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 🐳 Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

## 📊 Database Schema

### Key Entities
- **Users**: Customer and restaurant owner accounts
- **Restaurants**: Restaurant profiles and information
- **Menus**: Restaurant menu items
- **Orders**: Customer orders and order items
- **Reviews**: Customer reviews and ratings
- **Payments**: Payment transactions

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Customer, Restaurant, Admin)
- Password reset functionality
- Email verification

## 💳 Payment Integration

- Stripe integration for secure payments
- Support for multiple payment methods
- Order confirmation and receipts
- Refund processing

## 📱 Real-time Features

- Live order tracking
- Real-time notifications
- Chat support
- Order status updates

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection strings
- JWT secrets
- Stripe keys
- Email service credentials
- File storage configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🍕🍔🍜**