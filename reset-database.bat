@echo off
echo ===================================
echo SU Curries - Database Reset
echo ===================================
echo.
echo This will drop and recreate the database.
echo WARNING: All data will be lost!
echo.
pause

echo Dropping existing database...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "DROP DATABASE IF EXISTS su_foods_db;"

echo Creating new database...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "CREATE DATABASE su_foods_db;"

echo Creating user and granting permissions...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "CREATE USER su_foods_user WITH PASSWORD 'su_foods_password';"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE su_foods_db TO su_foods_user;"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d postgres -c "ALTER USER su_foods_user CREATEDB;"

echo.
echo Database reset completed!
echo.
pause