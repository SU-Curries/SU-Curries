

export interface TableReservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface CreateReservationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

/**
 * Restaurant service for handling table reservations
 */
export class RestaurantService {
  private static instance: RestaurantService;

  private constructor() {}

  /**
   * Get singleton instance of RestaurantService
   */
  public static getInstance(): RestaurantService {
    if (!RestaurantService.instance) {
      RestaurantService.instance = new RestaurantService();
    }
    return RestaurantService.instance;
  }

  /**
   * Get available time slots for a specific date
   */
  public async getAvailableTimeSlots(date: string): Promise<string[]> {
    // For demo purposes, return fixed time slots
    return [
      '17:00', '17:30', '18:00', '18:30', '19:00', 
      '19:30', '20:00', '20:30', '21:00', '21:30'
    ];
  }

  /**
   * Create a new table reservation
   */
  public async createReservation(data: CreateReservationRequest): Promise<TableReservation> {
    // For demo purposes, create a mock reservation
    const mockReservation: TableReservation = {
      id: `reservation-${Date.now()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      specialRequests: data.specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockReservation;
  }

  /**
   * Get user's reservations
   */
  public async getUserReservations(): Promise<TableReservation[]> {
    // For demo purposes, return empty array
    return [];
  }

  /**
   * Cancel a reservation
   */
  public async cancelReservation(id: string): Promise<TableReservation> {
    try {
      // For demo purposes, create a mock cancelled reservation
      const mockReservation: TableReservation = {
        id,
        customerName: 'Demo Customer',
        customerEmail: 'demo@example.com',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        partySize: 2,
        status: 'cancelled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockReservation;
    } catch (error) {
      console.error(`Failed to cancel reservation with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const restaurantService = RestaurantService.getInstance();