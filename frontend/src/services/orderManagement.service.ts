/**
 * Order Management Service
 * Handles complete order lifecycle, status tracking, and workflow automation
 */

import { emailService } from './email.service';
import { apiService } from './api.service';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  image?: string;
}

export interface OrderAddress {
  id?: string;
  type: 'delivery' | 'billing';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  deliveryAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: OrderStatusHistory[];
  refunds?: OrderRefund[];
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: Date;
  notes?: string;
  updatedBy: string;
  automated: boolean;
}

export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  processedAt?: Date;
  refundMethod: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  orderNumber?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
  paymentStatusBreakdown: Record<PaymentStatus, number>;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

class OrderManagementService {
  private readonly statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['out_for_delivery', 'delivered', 'cancelled'],
    out_for_delivery: ['delivered', 'cancelled'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: []
  };

  private readonly statusMessages: Record<OrderStatus, string> = {
    pending: 'Order received and awaiting confirmation',
    confirmed: 'Order confirmed and will be prepared soon',
    preparing: 'Your delicious curry is being prepared',
    ready: 'Order is ready for pickup/delivery',
    out_for_delivery: 'Order is on its way to you',
    delivered: 'Order has been delivered successfully',
    cancelled: 'Order has been cancelled',
    refunded: 'Order has been refunded'
  };

  /**
   * Create a new order
   */
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order | null> {
    try {
      const response = await apiService.post<Order>('/orders', {
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending'
      });

      if (response) {
        // Send order confirmation email
        await this.sendOrderConfirmationEmail(response);
        
        // Create initial status history
        await this.addStatusHistory(response.id, 'pending', 'Order created', 'system', true);
        
        return response;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      return await apiService.get<Order>(`/orders/${orderId}`);
    } catch (error) {
      console.error('Failed to get order:', error);
      return null;
    }
  }

  /**
   * Get orders with filters and pagination
   */
  async getOrders(filters?: OrderFilters, page = 1, limit = 20): Promise<{
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  } | null> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      return await apiService.get<any>(`/orders?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to get orders:', error);
      return null;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    notes?: string, 
    updatedBy = 'system'
  ): Promise<boolean> {
    try {
      const order = await this.getOrder(orderId);
      if (!order) return false;

      // Validate status transition
      if (!this.isValidStatusTransition(order.status, newStatus)) {
        throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
      }

      // Update order status
      const updatedOrder = await apiService.put<Order>(`/orders/${orderId}/status`, {
        status: newStatus,
        notes
      });

      if (updatedOrder) {
        // Add to status history
        await this.addStatusHistory(orderId, newStatus, notes, updatedBy, false);
        
        // Send status update email
        await this.sendStatusUpdateEmail(updatedOrder);
        
        // Handle automated workflows
        await this.handleStatusWorkflow(updatedOrder, newStatus);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string, refundAmount?: number): Promise<boolean> {
    try {
      const order = await this.getOrder(orderId);
      if (!order) return false;

      // Check if order can be cancelled
      if (!this.canCancelOrder(order)) {
        throw new Error('Order cannot be cancelled in current status');
      }

      // Update status to cancelled
      const success = await this.updateOrderStatus(orderId, 'cancelled', reason);
      
      if (success && refundAmount && refundAmount > 0) {
        // Process refund if requested
        await this.processRefund(orderId, refundAmount, reason || 'Order cancellation');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  }

  /**
   * Process refund for order
   */
  async processRefund(orderId: string, amount: number, reason: string): Promise<OrderRefund | null> {
    try {
      const refund = await apiService.post<OrderRefund>(`/orders/${orderId}/refunds`, {
        amount,
        reason,
        refundMethod: 'original_payment_method'
      });

      if (refund) {
        // Update payment status
        await apiService.put(`/orders/${orderId}/payment-status`, {
          paymentStatus: amount === (await this.getOrder(orderId))?.total ? 'refunded' : 'partially_refunded'
        });
      }

      return refund;
    } catch (error) {
      console.error('Failed to process refund:', error);
      return null;
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OrderStats | null> {
    try {
      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom.toISOString());
      if (dateTo) queryParams.append('dateTo', dateTo.toISOString());

      return await apiService.get<OrderStats>(`/orders/stats?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to get order stats:', error);
      return null;
    }
  }

  /**
   * Search orders
   */
  async searchOrders(query: string): Promise<Order[]> {
    try {
      return await apiService.get<Order[]>(`/orders/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Failed to search orders:', error);
      return [];
    }
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      return await apiService.get<Order[]>(`/customers/${customerId}/orders`);
    } catch (error) {
      console.error('Failed to get customer orders:', error);
      return [];
    }
  }

  /**
   * Validate status transition
   */
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    return this.statusTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Check if order can be cancelled
   */
  private canCancelOrder(order: Order): boolean {
    return ['pending', 'confirmed', 'preparing'].includes(order.status);
  }

  /**
   * Add status history entry
   */
  private async addStatusHistory(
    orderId: string,
    status: OrderStatus,
    notes?: string,
    updatedBy = 'system',
    automated = true
  ): Promise<void> {
    try {
      await apiService.post(`/orders/${orderId}/status-history`, {
        status,
        notes,
        updatedBy,
        automated,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to add status history:', error);
    }
  }

  /**
   * Send order confirmation email
   */
  private async sendOrderConfirmationEmail(order: Order): Promise<void> {
    try {
      await emailService.sendOrderConfirmation({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        orderItems: order.items,
        totalAmount: order.total,
        estimatedDelivery: order.estimatedDeliveryTime?.toLocaleString()
      });
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  /**
   * Send status update email
   */
  private async sendStatusUpdateEmail(order: Order): Promise<void> {
    try {
      await emailService.sendOrderStatusUpdate({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        newStatus: this.getStatusDisplayName(order.status),
        statusMessage: this.statusMessages[order.status]
      });
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  }

  /**
   * Handle automated workflows based on status changes
   */
  private async handleStatusWorkflow(order: Order, newStatus: OrderStatus): Promise<void> {
    try {
      switch (newStatus) {
        case 'confirmed':
          // Auto-transition to preparing after 5 minutes
          setTimeout(async () => {
            const currentOrder = await this.getOrder(order.id);
            if (currentOrder?.status === 'confirmed') {
              await this.updateOrderStatus(order.id, 'preparing', 'Auto-started preparation', 'system');
            }
          }, 5 * 60 * 1000);
          break;

        case 'ready':
          // Set estimated delivery time for delivery orders
          if (order.deliveryAddress) {
            const estimatedTime = new Date();
            estimatedTime.setMinutes(estimatedTime.getMinutes() + 30); // 30 min delivery
            
            await apiService.put(`/orders/${order.id}`, {
              estimatedDeliveryTime: estimatedTime
            });
          }
          break;

        case 'delivered':
          // Send follow-up email after 1 hour
          setTimeout(async () => {
            // Could send feedback request email here
            console.log(`Follow-up scheduled for order ${order.orderNumber}`);
          }, 60 * 60 * 1000);
          break;
      }
    } catch (error) {
      console.error('Failed to handle status workflow:', error);
    }
  }

  /**
   * Get display name for status
   */
  private getStatusDisplayName(status: OrderStatus): string {
    const displayNames: Record<OrderStatus, string> = {
      pending: 'Order Received',
      confirmed: 'Order Confirmed',
      preparing: 'Being Prepared',
      ready: 'Ready for Pickup/Delivery',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    
    return displayNames[status] || status;
  }

  /**
   * Calculate estimated delivery time
   */
  calculateEstimatedDeliveryTime(orderItems: OrderItem[], deliveryAddress?: OrderAddress): Date {
    const now = new Date();
    
    // Base preparation time: 15 minutes
    let prepTime = 15;
    
    // Add time based on number of items
    prepTime += orderItems.length * 2;
    
    // Add delivery time if delivery address provided
    let deliveryTime = 0;
    if (deliveryAddress) {
      deliveryTime = 25; // Average delivery time
    }
    
    const totalMinutes = prepTime + deliveryTime;
    now.setMinutes(now.getMinutes() + totalMinutes);
    
    return now;
  }

  /**
   * Get available status transitions for an order
   */
  getAvailableStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    return this.statusTransitions[currentStatus] || [];
  }

  /**
   * Get status message
   */
  getStatusMessage(status: OrderStatus): string {
    return this.statusMessages[status] || 'Status unknown';
  }
}

export const orderManagementService = new OrderManagementService();
export default orderManagementService;