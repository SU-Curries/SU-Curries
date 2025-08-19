import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, CheckCircleIcon, CalendarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingNumber: string;
    customerName: string;
    date: string;
    time: string;
    guestCount: number;
    specialRequests?: string;
  } | null;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  bookingDetails
}) => {
  if (!isOpen || !bookingDetails) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white text-center mb-2">
              Booking Confirmed!
            </h3>

            <p className="text-[#cccccc] text-center mb-6">
              Your table reservation has been successfully created. We look forward to serving you!
            </p>

            {/* Booking Details */}
            <div className="bg-[#2d2d2d] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#cccccc] text-sm">Booking Number</span>
                <span className="text-[#ff6b35] font-semibold">{bookingDetails.bookingNumber}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <span className="text-white font-medium">Date: </span>
                    <span className="text-[#cccccc]">{new Date(bookingDetails.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <span className="text-white font-medium">Time: </span>
                    <span className="text-[#cccccc]">{bookingDetails.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UsersIcon className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <span className="text-white font-medium">Party Size: </span>
                    <span className="text-[#cccccc]">{bookingDetails.guestCount} guests</span>
                  </div>
                </div>

                {bookingDetails.specialRequests && (
                  <div className="pt-2 border-t border-[#404040]">
                    <span className="text-white font-medium">Special Requests: </span>
                    <p className="text-[#cccccc] text-sm mt-1">{bookingDetails.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3 mb-6">
              <p className="text-blue-400 text-sm">
                <strong>Important:</strong> Please arrive 10 minutes before your reservation time. 
                A confirmation email has been sent to you with all the details.
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              <Link to="/bookings" className="flex-1">
                <Button
                  variant="primary"
                  className="w-full btn-hover-lift"
                >
                  View My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;