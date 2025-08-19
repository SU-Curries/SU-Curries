@echo off
echo ===================================
echo SU Curries - Application Test Guide
echo ===================================
echo.
echo This guide will help you test all features of the application.
echo.
echo DEMO ACCOUNTS:
echo ===============
echo.
echo 1. ADMIN ACCOUNT:
echo    Email: admin@sucurries.com
echo    Password: admin123
echo    Access: Full admin dashboard, order management, analytics
echo.
echo 2. CUSTOMER ACCOUNTS:
echo    Email: john.doe@example.com
echo    Password: password123
echo    
echo    Email: jane.smith@example.com
echo    Password: password123
echo    
echo    Email: mike.johnson@example.com
echo    Password: password123
echo    
echo    Email: sarah.wilson@example.com
echo    Password: password123
echo    
echo    Email: david.brown@example.com
echo    Password: password123
echo.
echo 3. DRIVER ACCOUNT:
echo    Email: driver@sucurries.com
echo    Password: driver123
echo    Access: Driver dashboard for deliveries
echo.
echo TESTING CHECKLIST:
echo ==================
echo.
echo [ ] 1. Login with different user accounts
echo [ ] 2. Customer: Place orders and view order history
echo [ ] 3. Customer: Make table bookings
echo [ ] 4. Admin: View dashboard with real analytics
echo [ ] 5. Admin: Manage orders and update statuses
echo [ ] 6. Admin: View all bookings
echo [ ] 7. Driver: View orders ready for delivery
echo [ ] 8. Driver: Mark orders as delivered
echo [ ] 9. Test user registration
echo [ ] 10. Verify theme consistency (dark theme throughout)
echo.
echo URLS TO TEST:
echo =============
echo Customer Interface: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin
echo Driver Dashboard: http://localhost:3000/driver
echo.
echo Press any key to continue...
pause > nul