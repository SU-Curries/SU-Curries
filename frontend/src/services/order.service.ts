import { apiService } from './api.service';
import { Product } from './product.service';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemDetail extends CartItem {
  product: Product;
}

export interface CartCalculation {
  items: CartItemDetail[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Order service for handling cart and order operations
 */
export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  /**
   * Get singleton instance of OrderService
   */
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Calculate cart totals
   */
  public async calculateCart(data: { items: CartItem[] }): Promise<CartCalculation> {
    try {
      // For demo purposes, calculate cart totals
      const { mockProducts } = await import('../data/mockData');
      
      const itemsWithDetails = data.items.map(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product: product || {
            id: item.productId,
            name: 'Unknown Product',
            price: 0,
            description: '',
            sku: '',
            stockQuantity: 0,
            status: 'inactive' as const,
            isFeatured: false,
            slug: '',
            categoryId: ''
          }
        };
      });
      
      const subtotal = itemsWithDetails.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
      );
      
      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = subtotal > 50 ? 0 : 5.99; // Free shipping over €50
      const discountAmount = 0;
      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
      
      return {
        items: itemsWithDetails,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        currency: 'EUR'
      };
    } catch (error) {
      console.error('Failed to calculate cart:', error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  public async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      // For demo purposes, create a mock order
      const orderNumber = `ORD-${Date.now()}`;
      const mockOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber,
        status: 'pending',
        items: data.items.map(item => ({
          productId: item.productId,
          productName: 'Product Name',
          quantity: item.quantity,
          price: 5.99,
          totalPrice: 5.99 * item.quantity
        })),
        subtotal: 50.00,
        taxAmount: 5.00,
        shippingAmount: 5.99,
        discountAmount: 0,
        totalAmount: 60.99,
        currency: 'EUR',
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  public async getOrder(id: string): Promise<Order> {
    try {
      // Use centralized data store
      const { dataStore } = await import('../store/dataStore');
      const order = dataStore.getOrderById(id);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      console.error(`Failed to fetch order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get orders for current user
   */
  public async getUserOrders(): Promise<Order[]> {
    try {
      // Use centralized data store
      const { dataStore } = await import('../store/dataStore');
      const { authService } = await import('./auth.service');
      
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }
      
      return dataStore.getUserOrders(currentUser.id);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  public async cancelOrder(id: string): Promise<Order> {
    try {
      return apiService.post<Order>(`/orders/${id}/cancel`, {});
    } catch (error) {
      console.error(`Failed to cancel order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all orders for admin
   */
  public async getAdminOrders(): Promise<{ orders: Order[] }> {
    try {
      // Use centralized data store
      const { dataStore } = await import('../store/dataStore');
      return { orders: dataStore.getOrders() };
    } catch (error) {
      console.error('Failed to fetch admin orders:', error);
      throw error;
    }
  }

  /**
   * Update an order
   */
  public async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    try {
      // Use centralized data store
      const { dataStore } = await import('../store/dataStore');
      const success = dataStore.updateOrder(id, data);
      if (!success) {
        throw new Error('Order not found');
      }
      const updatedOrder = dataStore.getOrderById(id);
      if (!updatedOrder) {
        throw new Error('Failed to retrieve updated order');
      }
      return updatedOrder;
    } catch (error) {
      console.error(`Failed to update order with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const orderService = OrderService.getInstance();