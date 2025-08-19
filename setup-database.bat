@echo off
echo ===================================
echo SU Curries - Database Setup
echo ===================================
echo.
echo This script will help you set up the PostgreSQL database.
echo Make sure PostgreSQL is installed and running.
echo.

echo Creating database and user...
echo.
echo Please enter your PostgreSQL superuser password when prompted.
echo.

psql -U postgres -c "CREATE DATABASE su_foods_db;"
psql -U postgres -c "CREATE USER su_foods_user WITH PASSWORD 'su_foods_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE su_foods_db TO su_foods_user;"
psql -U postgres -c "ALTER USER su_foods_user CREATEDB;"

echo.
echo ===================================
echo Database setup completed!
echo ===================================
echo.
echo Database: su_foods_db
echo User: su_foods_user
echo Password: su_foods_password
echo Host: localhost:5432
echo.
echo You can now run start-dev.bat to start the application.
echo.
pause