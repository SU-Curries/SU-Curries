import { apiService } from './api.service';

export interface Booking {
  id: string;
  userId?: string;
  bookingNumber: string;
  status: BookingStatus;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  notes?: string;
  tableNumber?: string;
  isVip?: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields
  restaurantTableId?: string;
  partySize?: number;
  totalAmount?: number;
  cancelledAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateBookingRequest {
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  notes?: string;
  restaurantTableId?: string;
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface BookingResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Booking service for handling restaurant table bookings
 */
export class BookingService {
  private static instance: BookingService;

  private constructor() {}

  /**
   * Get singleton instance of BookingService
   */
  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  /**
   * Create a new table booking
   */
  public async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      return apiService.post<Booking>('/bookings', data);
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  /**
   * Get user's bookings
   */
  public async getUserBookings(params?: BookingQueryParams): Promise<Booking[]> {
    try {
      // Use mock data for development
      const { extensiveMockBookings } = await import('../data/extensiveMockData');
      const { authService } = await import('./auth.service');
      
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }
      
      // Filter bookings by current user's email
      return extensiveMockBookings.filter(booking => 
        booking.customerEmail === currentUser.email
      );
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
      return [];
    }
  }

  /**
   * Get booking by ID
   */
  public async getBooking(id: string): Promise<Booking> {
    try {
      return apiService.get<Booking>(`/bookings/${id}`);
    } catch (error) {
      console.error(`Failed to fetch booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update booking
   */
  public async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    try {
      return apiService.patch<Booking>(`/bookings/${id}`, data);
    } catch (error) {
      console.error(`Failed to update booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel booking
   */
  public async cancelBooking(id: string): Promise<Booking> {
    try {
      return apiService.patch<Booking>(`/bookings/${id}/cancel`, {});
    } catch (error) {
      console.error(`Failed to cancel booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get admin bookings (admin only)
   */
  public async getAdminBookings(params?: BookingQueryParams): Promise<BookingResponse> {
    try {
      // Use mock data for development
      const { extensiveMockBookings } = await import('../data/extensiveMockData');
      
      return {
        data: extensiveMockBookings,
        meta: {
          total: extensiveMockBookings.length,
          page: 1,
          limit: 50,
          totalPages: 1
        }
      };
    } catch (error) {
      console.error('Failed to fetch admin bookings:', error);
      throw error;
    }
  }

  /**
   * Get booking statistics (admin only)
   */
  public async getBookingStats(): Promise<any> {
    try {
      return apiService.get('/bookings/stats');
    } catch (error) {
      console.error('Failed to fetch booking stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookingService = BookingService.getInstance();