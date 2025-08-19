/**
 * Order Management Service Tests
 * Comprehensive test suite for order management functionality
 */

import { orderManagementService, OrderStatus } from '../../services/orderManagement.service';
import { emailService } from '../../services/email.service';
import { apiService } from '../../services/api.service';
import { mockOrder, mockUser } from '../setup';

// Mock dependencies
jest.mock('../../services/email.service');
jest.mock('../../services/api.service');

const mockEmailService = emailService as jest.Mocked<typeof emailService>;
const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockEmailResponse = {
  messageId: 'test-message-id',
  status: 'sent' as const,
  timestamp: new Date()
};

describe('OrderManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('createOrder', () => {
    it('creates a new order successfully', async () => {
      const orderData = {
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
        status: 'pending' as OrderStatus,
        paymentStatus: 'pending' as const,
        paymentMethod: 'card',
      };

      const createdOrder = { ...mockOrder, ...orderData };
      mockApiService.post.mockResolvedValue(createdOrder);
      mockEmailService.sendOrderConfirmation.mockResolvedValue(mockEmailResponse);

      const result = await orderManagementService.createOrder(orderData);

      expect(mockApiService.post).toHaveBeenCalledWith('/orders', {
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending',
      });
      expect(mockEmailService.sendOrderConfirmation).toHaveBeenCalled();
      expect(result).toEqual(createdOrder);
    });

    it('handles order creation failure', async () => {
      const orderData = {
        customerId: '1',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        status: 'pending' as OrderStatus,
        paymentStatus: 'pending' as const,
        paymentMethod: 'card',
      };

      mockApiService.post.mockRejectedValue(new Error('API Error'));

      const result = await orderManagementService.createOrder(orderData);

      expect(result).toBeNull();
    });

    it('sends confirmation email after order creation', async () => {
      const orderData = {
        customerId: '1',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        items: [
          {
            id: '1',
            productId: '1',
            name: 'Chicken Curry',
            price: 12.99,
            quantity: 1,
          },
        ],
        subtotal: 12.99,
        tax: 1.30,
        deliveryFee: 3.99,
        total: 18.28,
        status: 'pending' as OrderStatus,
        paymentStatus: 'pending' as const,
        paymentMethod: 'card',
      };

      const createdOrder = { ...mockOrder, ...orderData };
      mockApiService.post.mockResolvedValue(createdOrder);
      mockEmailService.sendOrderConfirmation.mockResolvedValue(mockEmailResponse);

      await orderManagementService.createOrder(orderData);

      expect(mockEmailService.sendOrderConfirmation).toHaveBeenCalledWith({
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        orderNumber: createdOrder.orderNumber,
        orderItems: orderData.items,
        totalAmount: orderData.total,
        estimatedDelivery: undefined,
      });
    });
  });

  describe('getOrder', () => {
    it('retrieves order by ID successfully', async () => {
      mockApiService.get.mockResolvedValue(mockOrder);

      const result = await orderManagementService.getOrder('1');

      expect(mockApiService.get).toHaveBeenCalledWith('/orders/1');
      expect(result).toEqual(mockOrder);
    });

    it('handles order not found', async () => {
      mockApiService.get.mockRejectedValue(new Error('Order not found'));

      const result = await orderManagementService.getOrder('999');

      expect(result).toBeNull();
    });
  });

  describe('updateOrderStatus', () => {
    it('updates order status successfully', async () => {
      const updatedOrder = { ...mockOrder, status: 'confirmed' as OrderStatus };
      
      mockApiService.get.mockResolvedValue(mockOrder);
      mockApiService.put.mockResolvedValue(updatedOrder);
      mockApiService.post.mockResolvedValue({});
      mockEmailService.sendOrderStatusUpdate.mockResolvedValue(mockEmailResponse);

      const result = await orderManagementService.updateOrderStatus(
        '1',
        'confirmed',
        'Order confirmed by admin',
        'admin'
      );

      expect(mockApiService.put).toHaveBeenCalledWith('/orders/1/status', {
        status: 'confirmed',
        notes: 'Order confirmed by admin',
      });
      expect(mockEmailService.sendOrderStatusUpdate).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('validates status transitions', async () => {
      const deliveredOrder = { ...mockOrder, status: 'delivered' as OrderStatus };
      
      mockApiService.get.mockResolvedValue(deliveredOrder);

      const result = await orderManagementService.updateOrderStatus(
        '1',
        'preparing',
        'Invalid transition'
      );

      expect(result).toBe(false);
      expect(mockApiService.put).not.toHaveBeenCalled();
    });
  });

  describe('cancelOrder', () => {
    it('cancels order successfully', async () => {
      const updatedOrder = { ...mockOrder, status: 'cancelled' as OrderStatus };
      
      mockApiService.get.mockResolvedValue(mockOrder);
      mockApiService.put.mockResolvedValue(updatedOrder);
      mockApiService.post.mockResolvedValue({});
      mockEmailService.sendOrderStatusUpdate.mockResolvedValue(mockEmailResponse);

      const result = await orderManagementService.cancelOrder(
        '1',
        'Customer requested cancellation'
      );

      expect(result).toBe(true);
    });

    it('prevents cancellation of delivered orders', async () => {
      const deliveredOrder = { ...mockOrder, status: 'delivered' as OrderStatus };
      
      mockApiService.get.mockResolvedValue(deliveredOrder);

      const result = await orderManagementService.cancelOrder('1');

      expect(result).toBe(false);
    });
  });

  describe('calculateEstimatedDeliveryTime', () => {
    it('calculates delivery time correctly', () => {
      const orderItems = [
        {
          id: '1',
          productId: '1',
          name: 'Chicken Curry',
          price: 12.99,
          quantity: 2,
        },
        {
          id: '2',
          productId: '2',
          name: 'Rice',
          price: 3.99,
          quantity: 1,
        },
      ];

      const deliveryAddress = {
        type: 'delivery' as const,
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'City',
        postalCode: '12345',
        country: 'Country',
      };

      const result = orderManagementService.calculateEstimatedDeliveryTime(
        orderItems,
        deliveryAddress
      );

      // Base time (15) + items (2 * 2) + delivery (25) = 44 minutes
      const expectedTime = new Date();
      expectedTime.setMinutes(expectedTime.getMinutes() + 44);

      expect(result.getTime()).toBeCloseTo(expectedTime.getTime(), -4); // Within 10 seconds
    });

    it('calculates pickup time without delivery', () => {
      const orderItems = [
        {
          id: '1',
          productId: '1',
          name: 'Chicken Curry',
          price: 12.99,
          quantity: 1,
        },
      ];

      const result = orderManagementService.calculateEstimatedDeliveryTime(orderItems);

      // Base time (15) + items (1 * 2) = 17 minutes
      const expectedTime = new Date();
      expectedTime.setMinutes(expectedTime.getMinutes() + 17);

      expect(result.getTime()).toBeCloseTo(expectedTime.getTime(), -4); // Within 10 seconds
    });
  });

  describe('getAvailableStatusTransitions', () => {
    it('returns correct transitions for pending status', () => {
      const transitions = orderManagementService.getAvailableStatusTransitions('pending');
      expect(transitions).toEqual(['confirmed', 'cancelled']);
    });

    it('returns correct transitions for delivered status', () => {
      const transitions = orderManagementService.getAvailableStatusTransitions('delivered');
      expect(transitions).toEqual(['refunded']);
    });

    it('returns empty array for cancelled status', () => {
      const transitions = orderManagementService.getAvailableStatusTransitions('cancelled');
      expect(transitions).toEqual([]);
    });
  });

  describe('getStatusMessage', () => {
    it('returns correct message for each status', () => {
      expect(orderManagementService.getStatusMessage('pending'))
        .toBe('Order received and awaiting confirmation');
      expect(orderManagementService.getStatusMessage('confirmed'))
        .toBe('Order confirmed and will be prepared soon');
      expect(orderManagementService.getStatusMessage('preparing'))
        .toBe('Your delicious curry is being prepared');
      expect(orderManagementService.getStatusMessage('delivered'))
        .toBe('Order has been delivered successfully');
    });

    it('returns default message for unknown status', () => {
      expect(orderManagementService.getStatusMessage('unknown' as OrderStatus))
        .toBe('Status unknown');
    });
  });
});