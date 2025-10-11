# 🍽️ Foodies - Recipe Sharing Application

A modern, full-stack web application for food enthusiasts to discover, share, and manage their favorite recipes. Built with React, TypeScript, Node.js, Express, and Prisma.

![Foodies App](https://via.placeholder.com/800x400/f97316/ffffff?text=Foodies+App)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login system
- 📝 **Recipe Management** - Create, edit, delete, and browse recipes
- 🔍 **Advanced Search** - Search recipes by title, ingredients, category, and tags
- ❤️ **Favorites System** - Save and organize favorite recipes
- ⭐ **Rating & Reviews** - Rate recipes and leave detailed reviews
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🖼️ **Image Upload** - Upload and manage recipe photos
- 👤 **User Profiles** - Personalized profiles with bio and recipe collections
- 🏷️ **Categorization** - Organize recipes by meal type, cuisine, and difficulty
- 🎨 **Modern UI** - Beautiful, intuitive interface built with Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server development
- **Prisma** - Next-generation ORM
- **SQLite** - Database (development)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-reload
- **Concurrently** - Run multiple commands simultaneously

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodies-app
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client and run migrations
   npm run db:generate
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend server at `http://localhost:5173`
   - Backend API at `http://localhost:3001`

### Environment Variables

Create `.env` files in both `client` and `server` directories:

**client/.env:**
```env
VITE_API_URL=http://localhost:3001/api
```

**server/.env:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
UPLOAD_PATH="uploads"
```

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /api/recipes?page=1&limit=12&category=dinner&search=pasta&difficulty=easy&sortBy=createdAt&sortOrder=desc
```

#### Get Recipe by ID
```http
GET /api/recipes/:id
Authorization: Bearer <token> (optional)
```

#### Create Recipe
```http
POST /api/recipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta dish",
  "ingredients": ["spaghetti", "eggs", "cheese", "pancetta"],
  "instructions": ["Cook pasta", "Mix eggs and cheese", "Combine"],
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "medium",
  "category": "dinner",
  "tags": ["italian", "pasta"]
}
```

#### Update Recipe
```http
PUT /api/recipes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Recipe Title",
  "description": "Updated description"
}
```

#### Delete Recipe
```http
DELETE /api/recipes/:id
Authorization: Bearer <token>
```

#### Toggle Favorite
```http
POST /api/recipes/:id/favorite
Authorization: Bearer <token>
```

#### Upload Recipe Image
```http
POST /api/recipes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

#### Update Recipe Image
```http
PUT /api/recipes/:id/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile/:username
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Food enthusiast and home cook"
}
```

#### Get User Favorites
```http
GET /api/users/favorites?page=1&limit=12
Authorization: Bearer <token>
```

## 📁 Project Structure

```
foodies-app/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── ui/         # UI components (buttons, forms, etc.)
│   │   │   ├── forms/      # Form components
│   │   │   └── recipe/     # Recipe-specific components
│   │   ├── contexts/       # React contexts (auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── lib/            # Database connection and config
│   │   ├── seed.ts         # Database seeding script
│   │   └── server.ts       # Express server setup
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # Uploaded files storage
│   └── package.json        # Backend dependencies
├── public/                 # Shared static assets
├── package.json            # Root package.json for scripts
└── README.md              # Project documentation
```

## 🎨 Design System

The application uses a consistent design system built with Tailwind CSS:

### Colors
- **Primary**: Orange theme (`primary-500`, `primary-600`, etc.)
- **Secondary**: Gray tones for text and backgrounds
- **Success**: Green for positive actions
- **Error**: Red for error states
- **Warning**: Yellow for warnings

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with good readability

### Components
- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Consistent padding and states
- **Forms**: Clean inputs with validation states
- **Navigation**: Responsive menu with mobile support

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **File Upload Security**: Mime type checking and size limits
- **CORS Configuration**: Proper cross-origin setup
- **Security Headers**: Helmet.js for HTTP headers
- **SQL Injection Prevention**: Prisma ORM protection

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

Key responsive features:
- Collapsible navigation menu
- Flexible grid layouts
- Touch-friendly interactions
- Optimized images and media

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Run all tests
npm test

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client
```

## 🚀 Deployment

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

### Environment Setup

For production deployment, update the environment variables:

**Server (.env):**
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-strong-jwt-secret"
NODE_ENV="production"
PORT=3001
```

**Client (.env):**
```env
VITE_API_URL="https://your-api-domain.com/api"
```

### Docker Support (Optional)

Create `Dockerfile` and `docker-compose.yml` for containerized deployment:

```dockerfile
# Example Dockerfile for the server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Follow the existing code style
- Update documentation for new features

## 📝 Scripts Reference

### Root Level Scripts
- `npm run setup` - Install all dependencies
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm start` - Start the production server
- `npm test` - Run all tests

### Server Scripts
- `npm run dev:server` - Start backend development server
- `npm run build:server` - Build backend for production
- `npm run test:server` - Run backend tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Client Scripts
- `npm run dev:client` - Start frontend development server
- `npm run build:client` - Build frontend for production
- `npm run test:client` - Run frontend tests

## 🐛 Known Issues

- Image uploads are stored locally (consider cloud storage for production)
- Email verification is not implemented yet
- Password reset functionality is not implemented
- Real-time notifications are not implemented

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Real-time notifications
- [ ] Social media sharing
- [ ] Recipe import from URLs
- [ ] Meal planning features
- [ ] Grocery list generation
- [ ] Recipe scaling calculator
- [ ] Advanced search filters
- [ ] Recipe collections/cookbooks
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Cloud image storage
- [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [Prisma](https://prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool

## 🆘 Support

If you have any questions or need help with the project, please:

1. Check the [documentation](#-api-documentation)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

**Happy Cooking! 👨‍🍳👩‍🍳**

Made with ❤️ by the Foodies Team