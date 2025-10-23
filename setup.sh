#!/bin/bash

# Foodies App Setup Script
echo "🍽️ Setting up Foodies - Food Delivery Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "Visit: https://www.postgresql.org/download/"
    echo "Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Database setup
echo "🗄️  Setting up database..."
echo "Please make sure PostgreSQL is running and create a database named 'foodies_db'"
echo "You can run: createdb foodies_db"
read -p "Press Enter when database is ready..."

# Run database migrations
cd backend
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init
if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed"
else
    echo "❌ Database migrations failed"
    echo "Please check your database connection and try again"
    exit 1
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials and API keys"
echo "2. Update frontend/.env with your API URL if needed"
echo "3. Start the development servers:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "   docker-compose up --build"
echo ""
echo "Happy coding! 🚀"