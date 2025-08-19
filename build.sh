#!/bin/bash

echo "==================================="
echo "SU Curries Production Build Script"
echo "==================================="

echo
echo "Step 1: Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
  echo "Error installing frontend dependencies!"
  exit 1
fi

echo
echo "Step 2: Building frontend with production settings..."
cp .env.production .env
npm run build
if [ $? -ne 0 ]; then
  echo "Error building frontend!"
  exit 1
fi

echo
echo "Step 3: Installing backend dependencies..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
  echo "Error installing backend dependencies!"
  exit 1
fi

echo
echo "Step 4: Building backend..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error building backend!"
  exit 1
fi

echo
echo "Step 5: Copying frontend build to backend public folder..."
mkdir -p dist/public
cp -R ../frontend/build/* dist/public/
if [ $? -ne 0 ]; then
  echo "Error copying frontend build!"
  exit 1
fi

echo
echo "==================================="
echo "Build completed successfully!"
echo "==================================="
echo
echo "To start the production server:"
echo "cd backend"
echo "npm run start:prod"
echo
echo "The application will be available at http://localhost:3001"
echo "==================================="