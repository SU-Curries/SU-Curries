import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { productService, Product, Category } from '../services/product.service';
import { orderService, Order } from '../services/order.service';
import { bookingService, Booking } from '../services/booking.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import BookingManagement from '../components/admin/BookingManagement';
import SettingsManagement from '../components/admin/SettingsManagement';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBagIcon,
  CalendarIcon,
  CubeIcon,
  TagIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [] as Order[],
    recentBookings: [] as Booking[],
    products: [] as Product[],
    categories: [] as Category[],
    // Cooking classes removed
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Load all dashboard data in parallel
        const [
          products,
          categories,
          orders,
          bookings
        ] = await Promise.all([
          productService.getProducts({ limit: 100 }),
          productService.getCategories(),
          orderService.getUserOrders().catch(() => []), // Admin should have access to all orders
          bookingService.getUserBookings().catch(() => []) // Admin should have access to all bookings
        ]);

        setStats({
          totalOrders: orders.length,
          totalBookings: bookings.length,
          totalProducts: products.products?.length || 0,
          totalUsers: 0, // Would need admin endpoint
          recentOrders: orders.slice(0, 5),
          recentBookings: bookings.slice(0, 5),
          products: products.products || [],
          categories
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {t('admin.dashboard_title')}
        </h1>
        <p className="text-[#cccccc] mt-2">
          {t('admin.welcome_message', { name: user?.firstName })}
        </p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#2d2d2d] rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.total_orders')}</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.total_bookings')}</p>
              <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.total_products')}</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TagIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.total_categories')}</p>
              <p className="text-2xl font-bold text-white">{stats.categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-secondary-bg p-1 mb-8 overflow-x-auto">
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Dashboard
          </Tab>
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <UsersIcon className="h-5 w-5 inline mr-2" />
            Users
          </Tab>
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <CubeIcon className="h-5 w-5 inline mr-2" />
            Products
          </Tab>
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <ShoppingBagIcon className="h-5 w-5 inline mr-2" />
            Orders
          </Tab>
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <CalendarIcon className="h-5 w-5 inline mr-2" />
            Bookings
          </Tab>
          <Tab
            className={({ selected }) =>
              `whitespace-nowrap rounded-lg py-2.5 px-4 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            <CogIcon className="h-5 w-5 inline mr-2" />
            Settings
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Dashboard Overview */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-primary-bg rounded-lg shadow">
                <div className="px-6 py-4 border-b border-border-color">
                  <h3 className="text-lg font-medium text-text-primary">Recent Orders</h3>
                </div>
                <div className="p-6">
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-center text-text-secondary">No recent orders</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center py-2 border-b border-border-color last:border-b-0">
                          <div>
                            <p className="font-medium text-text-primary">#{order.orderNumber}</p>
                            <p className="text-sm text-text-secondary">Order #{order.orderNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-accent-color">€{(order.totalAmount || 0).toFixed(2)}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-primary-bg rounded-lg shadow">
                <div className="px-6 py-4 border-b border-border-color">
                  <h3 className="text-lg font-medium text-text-primary">Recent Bookings</h3>
                </div>
                <div className="p-6">
                  {stats.recentBookings.length === 0 ? (
                    <p className="text-center text-text-secondary">No recent bookings</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center py-2 border-b border-border-color last:border-b-0">
                          <div>
                            <p className="font-medium text-text-primary">{booking.customerName}</p>
                            <p className="text-sm text-text-secondary">
                              {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-text-secondary">{booking.guestCount || 1} guests</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* User Management */}
          <Tab.Panel>
            <UserManagement />
          </Tab.Panel>

          {/* Product Management */}
          <Tab.Panel>
            <ProductManagement />
          </Tab.Panel>

          {/* Order Management */}
          <Tab.Panel>
            <OrderManagement />
          </Tab.Panel>

          {/* Booking Management */}
          <Tab.Panel>
            <BookingManagement />
          </Tab.Panel>

          {/* Settings Management */}
          <Tab.Panel>
            <SettingsManagement />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminDashboard;