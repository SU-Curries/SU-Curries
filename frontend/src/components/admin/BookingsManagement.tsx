import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { bookingService } from '../../services/booking.service';
import { CalendarIcon, UserGroupIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAdminBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-900 text-green-300 border-green-500';
      case 'pending': return 'bg-yellow-900 text-yellow-300 border-yellow-500';
      case 'cancelled': return 'bg-red-900 text-red-300 border-red-500';
      case 'completed': return 'bg-blue-900 text-blue-300 border-blue-500';
      default: return 'bg-gray-900 text-gray-300 border-gray-500';
    }
  };

  const confirmBooking = (id: string) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status: 'confirmed' } : booking
    ));
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status: 'cancelled' } : booking
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Table Bookings Management</h2>
        <Button variant="primary" className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          View Calendar
        </Button>
      </div>

      <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
        <table className="min-w-full divide-y divide-[#404040]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-[#cccccc]">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-[#cccccc]">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {booking.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-[#cccccc]" />
                      {booking.bookingDate} at {booking.bookingTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-[#cccccc]" />
                      {booking.guestCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {booking.tableNumber || 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="secondary"
                          size="small"
                          className="mr-2"
                          onClick={() => confirmBooking(booking.id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button variant="secondary" size="small">
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsManagement;