#!/bin/bash

echo "🔄 Restarting Focipedia development servers..."

# Kill all existing processes
echo "🛑 Stopping all existing processes..."
pkill -f "next\|nest\|node.*dist/main.js" 2>/dev/null || true
sleep 3

# Check if ports are free
echo "🔍 Checking if ports are free..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "❌ Port 3000 is still in use"
    lsof -i :3000
    exit 1
fi

if lsof -i :3001 >/dev/null 2>&1; then
    echo "❌ Port 3001 is still in use"
    lsof -i :3001
    exit 1
fi

echo "✅ Ports are free"

# Start Redis if not running
echo "📡 Starting Redis..."
docker compose up redis -d

# Start backend
echo "🚀 Starting backend..."
cd apps/backend
npm run start:dev &
BACKEND_PID=$!
cd ../..
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Test backend
if curl -s http://localhost:3001/api/health >/dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    echo "Checking backend logs..."
    ps aux | grep "nest start" | grep -v grep
    echo "Trying to check if backend is starting..."
    sleep 5
    if curl -s http://localhost:3001/api/health >/dev/null; then
        echo "✅ Backend is now responding"
    else
        echo "❌ Backend is still not responding"
        exit 1
    fi
fi

# Start frontend
echo "🌐 Starting frontend..."
cd apps/frontend
npm run dev &
FRONTEND_PID=$!
cd ../..
echo "✅ Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Test frontend
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

echo ""
echo "🎉 All servers started successfully!"
echo "📡 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait 