import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, Booking } from '../services/booking.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { CalendarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

const BookingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await bookingService.getUserBookings();
      setBookings(userBookings);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20';
      case 'confirmed': return 'bg-green-400/10 text-green-400 border border-green-400/20';
      case 'cancelled': return 'bg-red-400/10 text-red-400 border border-red-400/20';
      case 'completed': return 'bg-blue-400/10 text-blue-400 border border-blue-400/20';
      default: return 'bg-secondary-bg/10 text-text-secondary border border-secondary-bg/20';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setCancelling(true);
      await bookingService.cancelBooking(bookingToCancel);
      await loadBookings(); // Reload bookings
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const closeCancelModal = () => {
    if (!cancelling) {
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Please Log In</h1>
          <p className="text-text-secondary mb-6">You need to be logged in to view your bookings.</p>
          <Link to="/login">
            <Button variant="primary" className="btn-hover-lift">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Bookings</h1>
          <p className="text-text-secondary mt-2">Manage your table reservations</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-secondary-bg mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">No Bookings Yet</h2>
            <p className="text-text-secondary mb-6">You haven't made any table reservations yet. Book a table to dine with us!</p>
            <Link to="/book-table">
              <Button variant="primary" className="btn-hover-lift">Book a Table</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-primary-bg border border-secondary-bg shadow-lg rounded-lg overflow-hidden card-hover">
                <div className="px-6 py-4 border-b border-secondary-bg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        Booking #{booking.bookingNumber}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Made on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-[#ff6b35]" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Date</p>
                        <p className="text-sm text-text-secondary">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-[#ff6b35]" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Time</p>
                        <p className="text-sm text-text-secondary">{booking.bookingTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <UsersIcon className="h-5 w-5 text-[#ff6b35]" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Party Size</p>
                        <p className="text-sm text-text-secondary">{booking.guestCount} guests</p>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-text-primary">Special Requests</p>
                      <p className="text-sm text-text-secondary mt-1">{booking.specialRequests}</p>
                    </div>
                  )}

                  {booking.tableNumber && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-text-primary">Table Assignment</p>
                      <p className="text-sm text-text-secondary mt-1">{booking.tableNumber}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm">
                      {booking.status === 'confirmed' && (
                        <span className="text-green-400">✓ Confirmed - See you soon!</span>
                      )}
                      {booking.status === 'pending' && (
                        <span className="text-yellow-400">⏳ Awaiting confirmation</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-red-400">✗ Cancelled</span>
                      )}
                      {booking.status === 'completed' && (
                        <span className="text-blue-400">✓ Completed - Thank you for dining with us!</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button 
                          variant="primary" 
                          size="small"
                          destructive={true}
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn-hover-lift"
                        >
                          Cancel Booking
                        </Button>
                      )}
                      
                      {booking.status === 'completed' && (
                        <Link to="/book-table">
                          <Button variant="primary" size="small" className="btn-hover-lift">
                            Book Again
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Booking Modal */}
        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={closeCancelModal}
          onConfirm={confirmCancelBooking}
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone and you may need to make a new reservation."
          type="danger"
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          loading={cancelling}
        />
      </div>
    </div>
  );
};

export default BookingsPage;