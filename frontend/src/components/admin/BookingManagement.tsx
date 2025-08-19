import React, { useState, useEffect } from 'react';
import { bookingService, Booking } from '../../services/booking.service';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import { EyeIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAdminBookings();
      setBookings(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await bookingService.updateBooking(bookingId, { status: newStatus as any });
      await loadBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="text-sm text-gray-500">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{booking.id.slice(0, 8)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.customerName}
                  </div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                  {booking.customerPhone && (
                    <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Class Booking
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.guestCount || 1} guests
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                    className={`text-sm border-0 rounded-full px-3 py-1 font-semibold ${getStatusColor(booking.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="flex items-center"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="flex items-center bg-red-500 text-white hover:bg-red-600"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bookings found matching your criteria.
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Booking #{selectedBooking.id.slice(0, 8)}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Information</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.customerEmail}</p>
                    {selectedBooking.customerPhone && (
                      <p className="text-sm text-gray-600">{selectedBooking.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Booking Status</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Created on {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Booking Details</h4>
                    <p className="text-sm text-gray-600">
                      Table: {selectedBooking.tableNumber || 'Restaurant Table'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Guests: {selectedBooking.guestCount || 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: €{selectedBooking.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Additional Info</h4>
                    <p className="text-sm text-gray-600">
                      Booking ID: {selectedBooking.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {selectedBooking.status}
                    </p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;