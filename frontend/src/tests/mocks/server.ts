/**
 * Mock Server Setup for Tests
 * Simplified mock server without MSW dependency
 */

import { mockUser, mockProduct, mockOrder } from '../setup';

// Mock data
const mockProducts = [
  mockProduct,
  {
    id: '2',
    name: 'Beef Curry',
    description: 'Spicy beef curry',
    price: 14.99,
    category: 'main',
    image: '/images/beef-curry.jpg',
    available: true,
    spiceLevel: 'hot',
    allergens: ['dairy'],
    nutritionalInfo: {
      calories: 520,
      protein: 30,
      carbs: 25,
      fat: 28,
    },
  },
];

const mockOrders = [mockOrder];

const mockBookings = [
  {
    id: '1',
    bookingNumber: 'BK-001',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    customerPhone: '+1234567890',
    date: '2024-02-15',
    time: '19:00',
    guestCount: 4,
    status: 'confirmed',
    specialRequests: 'Window table please',
    createdAt: new Date(),
  },
];

// Mock server implementation
export const server = {
  listen: () => {},
  close: () => {},
  resetHandlers: () => {},
  use: () => {},
};

// Mock handlers (simplified)
export const handlers = [
  // Mock handlers would go here if needed
];

// Export mock data for tests
export { mockProducts, mockOrders, mockBookings };