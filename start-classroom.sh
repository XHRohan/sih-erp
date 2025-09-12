#!/bin/bash

echo "Starting Online Classroom System..."
echo

echo "Installing server dependencies..."
cd server
npm install
echo

echo "Starting Socket.IO server in background..."
npm start &
SERVER_PID=$!
echo "Socket.IO server started on port 3001 (PID: $SERVER_PID)"
echo

echo "Waiting 3 seconds for server to initialize..."
sleep 3

cd ..
echo "Starting Next.js application..."
npm run dev &
APP_PID=$!
echo "Next.js app started on port 3000 (PID: $APP_PID)"
echo

echo "Both servers are running:"
echo "- Socket.IO Server: http://localhost:3001"
echo "- Next.js App: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $APP_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user input
wait