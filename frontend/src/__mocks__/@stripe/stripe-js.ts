/**
 * Stripe.js Mock for Testing
 * Mock implementation of Stripe.js for testing purposes
 */

export const loadStripe = jest.fn(() => Promise.resolve({
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
  confirmCardPayment: jest.fn(() => Promise.resolve({ 
    paymentIntent: { status: 'succeeded' } 
  })),
  confirmPayment: jest.fn(() => Promise.resolve({ 
    paymentIntent: { status: 'succeeded' } 
  })),
  createPaymentMethod: jest.fn(() => Promise.resolve({ 
    paymentMethod: { id: 'pm_test' } 
  })),
}));

export default {
  loadStripe,
};