import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import BookingSuccessModal from '../components/common/BookingSuccessModal';
import { useAuth } from '../context/AuthContext';
import { restaurantService } from '../services/restaurant.service';
import { useTranslation } from 'react-i18next';

const BookTablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    time: '',
    partySize: 2,
    specialRequests: '',
  });

  // Load available time slots when date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        setLoading(true);
        const times = await restaurantService.getAvailableTimeSlots(formData.date);
        setAvailableTimes(times);
        
        // Set default time if available
        if (times.length > 0 && !formData.time) {
          setFormData(prev => ({ ...prev, time: times[0] }));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };
    
    loadTimeSlots();
  }, [formData.date, formData.time]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      // Create reservation request
      const reservationRequest = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone || undefined,
        date: formData.date,
        time: formData.time,
        partySize: Number(formData.partySize),
        specialRequests: formData.specialRequests || undefined,
      };
      
      // Submit reservation
      const booking = await restaurantService.createReservation(reservationRequest);
      
      // Set booking details for modal
      setBookingDetails({
        bookingNumber: booking.id || `BK-${Date.now()}`,
        customerName: formData.name,
        date: formData.date,
        time: formData.time,
        guestCount: formData.partySize,
        specialRequests: formData.specialRequests
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form (except for name, email, phone if user is logged in)
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
        time: availableTimes.length > 0 ? availableTimes[0] : '',
        partySize: 2,
        specialRequests: '',
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate min date (today) and max date (3 months from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{t('restaurant.book_table')}</h1>
      
      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}
      
        <Card className="p-8 bg-[#1a1a1a] border-[#2d2d2d]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              name="name"
              label={t('restaurant.name')}
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitting || success !== ''}
            />
            <Input
              type="email"
              name="email"
              label={t('restaurant.email')}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submitting || success !== ''}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="tel"
              name="phone"
              label={t('restaurant.phone')}
              value={formData.phone}
              onChange={handleChange}
              disabled={submitting || success !== ''}
            />
            <div>
              <label htmlFor="partySize" className="block text-sm font-medium text-[#cccccc] mb-1">
                {t('restaurant.party_size')}
              </label>
              <input
                type="number"
                id="partySize"
                name="partySize"
                value={formData.partySize}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full p-2 rounded-md bg-[#2d2d2d] border border-[#404040] text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
                required
                disabled={submitting || success !== ''}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#cccccc] mb-1">
                {t('restaurant.date')}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                max={maxDateStr}
                className="w-full p-2 rounded-md bg-[#2d2d2d] border border-[#404040] text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
                required
                disabled={submitting || success !== ''}
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-[#cccccc] mb-1">
                {t('restaurant.time')}
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#2d2d2d] border border-[#404040] text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
                required
                disabled={submitting || success !== '' || loading || availableTimes.length === 0}
              >
                {loading ? (
                  <option value="">{t('restaurant.loading_times')}</option>
                ) : availableTimes.length === 0 ? (
                  <option value="">{t('restaurant.no_times_available')}</option>
                ) : (
                  availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-[#cccccc] mb-1">
              {t('restaurant.special_requests')}
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              placeholder={t('restaurant.special_requests_placeholder')}
              className="w-full p-2 rounded-md bg-[#2d2d2d] border border-[#404040] text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
              disabled={submitting || success !== ''}
            />
          </div>
          
          <div className="bg-[#2d2d2d] p-4 rounded-md text-sm border border-[#404040]">
            <h3 className="font-semibold mb-2 text-white">{t('restaurant.reservation_info')}</h3>
            <ul className="space-y-1 text-[#cccccc]">
              <li>{t('restaurant.reservation_note_1')}</li>
              <li>{t('restaurant.reservation_note_2')}</li>
              <li>{t('restaurant.reservation_note_3')}</li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full btn-hover-lift"
            disabled={submitting || success !== '' || loading || availableTimes.length === 0}
          >
            {submitting ? t('common.processing') : t('restaurant.reserve_table')}
          </Button>
        </form>
        </Card>

        {/* Booking Success Modal */}
        <BookingSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          bookingDetails={bookingDetails}
        />
      </div>
    </div>
  );
};

export default BookTablePage; 