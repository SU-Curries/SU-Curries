@echo off
echo ===================================
echo SU Curries - Fresh Database Setup
echo ===================================
echo.
echo This will create a completely fresh database with extensive mock data.
echo.

echo [1/4] Dropping existing database...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "DROP DATABASE IF EXISTS su_foods_db;"

echo [2/4] Creating new database...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "CREATE DATABASE su_foods_db;"

echo [3/4] Creating user and permissions...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "DROP USER IF EXISTS su_foods_user;"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "CREATE USER su_foods_user WITH PASSWORD 'su_foods_password';"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE su_foods_db TO su_foods_user;"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "ALTER USER su_foods_user CREATEDB;"

echo [4/4] Database setup completed!
echo.
echo Next: Start the backend to create tables, then run the mock data seeder.
echo.
pause