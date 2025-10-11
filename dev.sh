#!/bin/bash

# Foodies Development Script
echo "🍽️ Starting Foodies Development Environment"
echo "==========================================="

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found. Please run ./setup.sh first"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ frontend/.env not found. Please run ./setup.sh first"
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo "📊 API Docs: http://localhost:5000/api-docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait