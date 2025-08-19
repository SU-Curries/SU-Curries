/**
 * Test Setup Configuration
 * Global test setup for Jest and React Testing Library
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as any).localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as any).sessionStorage = sessionStorageMock;

// Mock fetch
(global as any).fetch = jest.fn();

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    now: jest.fn(() => Date.now()),
  },
  writable: true,
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
  writable: true,
});

// Mock console methods to reduce noise in tests
(global as any).console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Stripe for integration tests
(global as any).Stripe = jest.fn(() => ({
  elements: jest.fn(() => ({
    create: jest.fn(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      destroy: jest.fn(),
    })),
    getElement: jest.fn(),
  })),
  confirmCardPayment: jest.fn(() => Promise.resolve({ paymentIntent: { status: 'succeeded' } })),
  confirmPayment: jest.fn(() => Promise.resolve({ paymentIntent: { status: 'succeeded' } })),
  createPaymentMethod: jest.fn(() => Promise.resolve({ paymentMethod: { id: 'pm_test' } })),
}));

// Global test utilities and mock data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'customer',
};

export const mockProduct = {
  id: '1',
  name: 'Chicken Curry',
  description: 'Delicious chicken curry',
  price: 12.99,
  category: 'main',
  image: '/images/chicken-curry.jpg',
  available: true,
  spiceLevel: 'medium',
  allergens: ['dairy'],
  nutritionalInfo: {
    calories: 450,
    protein: 25,
    carbs: 30,
    fat: 20,
  },
};

export const mockOrder = {
  id: '1',
  orderNumber: 'ORD-001',
  customerId: '1',
  customerName: 'Test User',
  customerEmail: 'test@example.com',
  items: [
    {
      id: '1',
      productId: '1',
      name: 'Chicken Curry',
      price: 12.99,
      quantity: 2,
    },
  ],
  subtotal: 25.98,
  tax: 2.60,
  deliveryFee: 3.99,
  total: 32.57,
  status: 'pending' as const,
  paymentStatus: 'pending' as const,
  paymentMethod: 'card',
  createdAt: new Date(),
  updatedAt: new Date(),
  statusHistory: [],
};