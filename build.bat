@echo off
echo ===================================
echo SU Curries Production Build Script
echo ===================================

echo.
echo Step 1: Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
  echo Error installing frontend dependencies!
  exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Building frontend with production settings...
copy /Y .env.production .env
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error building frontend!
  exit /b %ERRORLEVEL%
)

echo.
echo Step 3: Installing backend dependencies...
cd ..\backend
call npm install
if %ERRORLEVEL% neq 0 (
  echo Error installing backend dependencies!
  exit /b %ERRORLEVEL%
)

echo.
echo Step 4: Building backend...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error building backend!
  exit /b %ERRORLEVEL%
)

echo.
echo Step 5: Copying frontend build to backend public folder...
mkdir dist\public
xcopy /E /I /Y ..\frontend\build dist\public
if %ERRORLEVEL% neq 0 (
  echo Error copying frontend build!
  exit /b %ERRORLEVEL%
)

echo.
echo ===================================
echo Build completed successfully!
echo ===================================
echo.
echo To start the production server:
echo cd backend
echo npm run start:prod
echo.
echo The application will be available at http://localhost:3001
echo ===================================