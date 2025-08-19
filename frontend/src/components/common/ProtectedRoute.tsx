import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role if specified
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Access denied: Required role ${requiredRole}, user has role ${user?.role}`);
    return <Navigate to="/" replace />;
  }

  // Render children if provided, otherwise render Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;