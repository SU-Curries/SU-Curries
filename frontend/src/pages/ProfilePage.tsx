import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, UserProfile } from '../services/user.service';
import { orderService, Order } from '../services/order.service';
import { bookingService, Booking } from '../services/booking.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Tab } from '@headlessui/react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError('');

        // Load user profile
        const userProfile = await userService.getProfile();
        setProfile(userProfile);

        // Load user orders
        const userOrders = await orderService.getUserOrders();
        setOrders(userOrders);

        // Load user bookings
        const userBookings = await bookingService.getUserBookings();
        setBookings(userBookings);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-secondary-bg p-1 mb-8">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            {t('profile.personal_info')}
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            {t('profile.orders')}
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                selected
                  ? 'bg-accent-color text-white shadow'
                  : 'text-text-secondary hover:bg-white/[0.12] hover:text-text-primary'
              }`
            }
          >
            {t('profile.bookings')}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Personal Information */}
          <Tab.Panel>
            <div className="bg-primary-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('profile.personal_info')}</h2>
              
              {profile && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('profile.first_name')}
                      </label>
                      <p className="text-text-primary">{profile.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('profile.last_name')}
                      </label>
                      <p className="text-text-primary">{profile.lastName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t('profile.email')}
                    </label>
                    <p className="text-text-primary">{profile.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t('profile.phone')}
                    </label>
                    <p className="text-text-primary">{profile.phone || t('profile.not_provided')}</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="primary">{t('profile.edit_profile')}</Button>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Orders */}
          <Tab.Panel>
            <div className="bg-primary-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('profile.order_history')}</h2>
              
              {orders.length === 0 ? (
                <p className="text-text-secondary">{t('profile.no_orders')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border-color">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.order_number')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.date')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.status')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.total')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            €{(order.totalAmount || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            <Button variant="secondary" size="small">
                              {t('profile.view_details')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Bookings */}
          <Tab.Panel>
            <div className="bg-primary-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('profile.booking_history')}</h2>
              
              {bookings.length === 0 ? (
                <p className="text-text-secondary">{t('profile.no_bookings')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border-color">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.class')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.date')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.attendees')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.status')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          {t('profile.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            Table Booking
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            {booking.guestCount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                            <Button 
                              variant="secondary" 
                              size="small"
                              disabled={booking.status === 'cancelled'}
                            >
                              {t('profile.view_details')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfilePage;