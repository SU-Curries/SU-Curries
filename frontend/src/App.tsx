import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import SplashScreen from './components/common/SplashScreen';
import { NotificationProvider } from './components/common/NotificationSystem';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const BookTablePage = lazy(() => import('./pages/BookTablePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CateringPage = lazy(() => import('./pages/CateringPage'));

const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// Admin routes with separate chunk for better code splitting
const AdminDashboard = lazy(() => import(/* webpackChunkName: "admin" */ './pages/admin/AdminDashboard'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const ForgotPasswordPage = () => <div className="text-center text-2xl">Forgot Password Page - To be implemented</div>;

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize performance monitoring
  const { startMeasurement, endMeasurement } = usePerformanceMonitoring({
    enabled: true,
    reportToAnalytics: process.env.NODE_ENV === 'production'
  });

  useEffect(() => {
    startMeasurement('app-initialization');
    
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      endMeasurement('app-initialization');
    }, 2000);

    return () => clearTimeout(timer);
  }, [startMeasurement, endMeasurement]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <Suspense fallback={<div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}>
                  <Routes>
                {/* Public Routes with Layout */}
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/book-table" element={<BookTablePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/orders/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/catering" element={<CateringPage />} />
                  
                  {/* Protected Routes within Layout */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/favourites" element={<FavouritesPage />} />
                  </Route>
                </Route>
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Driver Routes */}
                <Route path="/driver" element={<DriverDashboard />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Router>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
