#!/bin/bash

# Set log file path
LOG_FILE="$(pwd)/startup.log"

# Redirect stdout and stderr to log file
exec > >(tee -a "$LOG_FILE") 2>&1

echo "===== Script started at $(date) ====="

# Start frontend
echo "Starting Frontend..."
cd /applications/CRS-PRODUCTION-LIVE/retail-front-end || {
    echo "Failed to cd into frontend directory"
    exit 1
}
npm run dev &

# Give frontend time to start
echo "Waiting for frontend to initialize..."
sleep 8

# Check if frontend is ready
if curl -s http://localhost:5173 > /dev/null; then
    echo "Frontend is ready on port 5173"
else
    echo "Warning: Frontend may not be fully ready, but continuing..."
fi

# Start backend
echo "Starting Backend..."
cd /applications/CRS-PRODUCTION-LIVE/retail-backend || {
    echo "Failed to cd into backend directory"
    exit 1
}
npm run dev

# This keeps the backend running in foreground
