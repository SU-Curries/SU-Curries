@echo off
echo ===================================
echo SU Curries - Easy Startup
echo ===================================
echo.
echo This will start your restaurant website with:
echo - PostgreSQL Database (localhost:5432)
echo - Backend API Server
echo - Frontend Website
echo.

echo [1/3] Checking PostgreSQL connection...
echo Connecting to PostgreSQL database: su_foods_db
echo Host: localhost:5432
echo User: su_foods_user

echo.
echo [2/3] Starting backend server (API)...
start "SU Curries Backend" cmd /k "cd backend && echo Starting backend with PostgreSQL database... && npm run start:dev"

echo Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo.
echo [3/3] Starting frontend server (Website)...
start "SU Curries Frontend" cmd /k "cd frontend && echo Building and starting website... && npm start"

echo.
echo ===================================
echo SUCCESS! Your restaurant website is starting up:
echo ===================================
echo.
echo Backend API:  http://localhost:3001
echo Website:      http://localhost:3000
echo Database:     PostgreSQL (localhost:5432/su_foods_db)
echo.
echo DEMO ACCOUNTS:
echo Admin:    admin@sucurries.com / admin123
echo Customer: user@sucurries.com / user123
echo.
echo The website will open automatically in a few seconds...
echo Both servers will run in separate windows.
echo.
echo Press any key to close this window (servers will keep running)
pause > nul