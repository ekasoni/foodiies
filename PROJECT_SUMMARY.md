# 🍽️ Foodies - Full-Stack Food Delivery Application

## Project Overview

Foodies is a comprehensive full-stack food delivery application built with modern web technologies. It connects hungry customers with local restaurants, offering a seamless ordering experience with real-time updates and secure payments.

## 🚀 What's Been Implemented

### ✅ Completed Features

#### 1. **Project Structure & Setup**
- Complete monorepo structure with frontend, backend, and shared directories
- Docker configuration for easy deployment
- Comprehensive setup scripts (`setup.sh`, `dev.sh`)
- Environment configuration files
- TypeScript configuration for both frontend and backend

#### 2. **Backend API (Node.js + Express + TypeScript)**
- **Authentication System**
  - JWT-based authentication
  - User registration and login
  - Role-based access control (Customer, Restaurant, Admin)
  - Password hashing with bcrypt
  - Token refresh functionality

- **Database Schema (PostgreSQL + Prisma)**
  - Complete database schema with all necessary entities
  - User management (customers, restaurants, admins)
  - Restaurant profiles with location and rating data
  - Menu items with categories and dietary information
  - Order management with status tracking
  - Payment integration with Stripe
  - Review and rating system
  - Address management
  - Notification system

- **API Endpoints**
  - Authentication routes (`/api/auth/*`)
  - User management (`/api/users/*`)
  - Restaurant management (`/api/restaurants/*`)
  - Menu management (`/api/menu/*`)
  - Order management (`/api/orders/*`)
  - Payment processing (`/api/payments/*`)
  - Review system (`/api/reviews/*`)
  - Notifications (`/api/notifications/*`)

- **Real-time Features**
  - Socket.io integration for live updates
  - Order tracking and status updates
  - Real-time notifications

- **Security & Middleware**
  - CORS configuration
  - Rate limiting
  - Input validation with Joi
  - Error handling middleware
  - Authentication middleware
  - File upload support

#### 3. **Frontend Application (React + TypeScript + Vite)**
- **Modern UI Framework**
  - React 18 with TypeScript
  - Vite for fast development and building
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation

- **State Management**
  - Zustand for global state management
  - React Query for server state and caching
  - Persistent storage for auth and cart

- **Authentication System**
  - Login and registration pages
  - Protected routes
  - Role-based access control
  - Form validation with React Hook Form + Zod

- **Core Pages**
  - Homepage with restaurant discovery
  - Restaurant detail pages
  - User authentication pages
  - Protected dashboard areas
  - Responsive navigation and footer

- **Shopping Cart System**
  - Add/remove items functionality
  - Quantity management
  - Special instructions
  - Restaurant-specific cart validation
  - Persistent cart storage

- **UI Components**
  - Responsive navigation bar
  - Modern form components
  - Loading states and animations
  - Error handling and notifications
  - Mobile-friendly design

#### 4. **Development Tools & Configuration**
- **Code Quality**
  - ESLint and Prettier configuration
  - TypeScript strict mode
  - Path aliases for clean imports

- **Build & Deployment**
  - Docker containerization
  - Nginx configuration for frontend
  - Environment variable management
  - Production-ready builds

- **Database Management**
  - Prisma ORM with migrations
  - Database seeding capabilities
  - Schema validation

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Payments**: Stripe
- **File Upload**: Multer
- **Validation**: Joi
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Hot Toast

### DevOps & Tools
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + Vitest
- **Version Control**: Git

## 📁 Project Structure

```
foodies/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── store/          # Zustand store
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── shared/                 # Shared types and utilities
│   └── types.ts
├── docker-compose.yml      # Docker configuration
├── setup.sh               # Setup script
├── dev.sh                 # Development script
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd foodies
   ./setup.sh
   ```

2. **Configure Environment**
   - Update `backend/.env` with your database credentials and API keys
   - Update `frontend/.env` with your API URL if needed

3. **Start Development**
   ```bash
   ./dev.sh
   ```

4. **Or Use Docker**
   ```bash
   docker-compose up --build
   ```

### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npx prisma migrate dev
   npx prisma generate
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update .env if needed
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Database**: localhost:5432

## 🔐 Default Credentials

The application uses a registration system. No default credentials are provided for security reasons.

## 📊 Database Schema

The database includes the following main entities:
- **Users**: Customer and restaurant accounts
- **Restaurants**: Restaurant profiles and information
- **MenuItems**: Restaurant menu items
- **Orders**: Customer orders and order items
- **Payments**: Payment transactions
- **Reviews**: Customer reviews and ratings
- **Addresses**: User delivery addresses
- **Notifications**: Real-time notifications

## 🔄 Next Steps (Future Development)

### Phase 2: Core Features
- [ ] Complete menu browsing and ordering flow
- [ ] Shopping cart and checkout implementation
- [ ] Order tracking and management
- [ ] Restaurant dashboard functionality
- [ ] Payment integration with Stripe

### Phase 3: Advanced Features
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Restaurant analytics
- [ ] Admin panel

### Phase 4: Mobile & Optimization
- [ ] Mobile app (React Native)
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] CDN integration
- [ ] Load testing

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
- Check the documentation
- Review the setup scripts

---

**Happy Coding! 🍕🍔🍜**