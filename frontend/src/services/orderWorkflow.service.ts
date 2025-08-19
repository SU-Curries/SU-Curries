/**
 * Order Workflow Management Service
 * Handles order lifecycle, status updates, and automated workflows
 */

import { emailService } from './email.service';
import { gdprService } from './gdpr.service';

export interface OrderStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isTerminal: boolean;
  allowedTransitions: string[];
}

export interface OrderWorkflowStep {
  id: string;
  orderId: string;
  status: string;
  timestamp: Date;
  performedBy: string;
  notes?: string;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  metadata?: Record<string, any>;
}

export interface OrderNotification {
  id: string;
  orderId: string;
  type: 'status_change' | 'delay' | 'ready' | 'delivered' | 'cancelled';
  recipient: 'customer' | 'staff' | 'admin';
  channel: 'email' | 'sms' | 'push' | 'in_app';
  sent: boolean;
  sentAt?: Date;
  error?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: {
    event: 'status_change' | 'time_elapsed' | 'manual';
    conditions: Record<string, any>;
  };
  actions: WorkflowAction[];
  enabled: boolean;
}

export interface WorkflowAction {
  type: 'send_notification' | 'update_status' | 'assign_staff' | 'create_task' | 'log_event';
  parameters: Record<string, any>;
  delay?: number; // in minutes
}

class OrderWorkflowService {
  private static instance: OrderWorkflowService;
  private apiBaseUrl: string;
  private orderStatuses: OrderStatus[] = [];
  private workflowRules: WorkflowRule[] = [];

  private constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
    this.initializeOrderStatuses();
    this.initializeWorkflowRules();
  }

  public static getInstance(): OrderWorkflowService {
    if (!OrderWorkflowService.instance) {
      OrderWorkflowService.instance = new OrderWorkflowService();
    }
    return OrderWorkflowService.instance;
  }

  /**
   * Initialize order statuses
   */
  private initializeOrderStatuses(): void {
    this.orderStatuses = [
      {
        id: 'pending',
        name: 'Pending',
        description: 'Order received, awaiting payment confirmation',
        color: '#fbbf24',
        icon: 'clock',
        isTerminal: false,
        allowedTransitions: ['confirmed', 'cancelled']
      },
      {
        id: 'confirmed',
        name: 'Confirmed',
        description: 'Payment confirmed, order being prepared',
        color: '#3b82f6',
        icon: 'check-circle',
        isTerminal: false,
        allowedTransitions: ['preparing', 'cancelled']
      },
      {
        id: 'preparing',
        name: 'Preparing',
        description: 'Order is being prepared in the kitchen',
        color: '#f59e0b',
        icon: 'fire',
        isTerminal: false,
        allowedTransitions: ['ready', 'delayed', 'cancelled']
      },
      {
        id: 'ready',
        name: 'Ready',
        description: 'Order is ready for pickup/delivery',
        color: '#10b981',
        icon: 'bell',
        isTerminal: false,
        allowedTransitions: ['out_for_delivery', 'picked_up', 'cancelled']
      },
      {
        id: 'out_for_delivery',
        name: 'Out for Delivery',
        description: 'Order is on the way to customer',
        color: '#8b5cf6',
        icon: 'truck',
        isTerminal: false,
        allowedTransitions: ['delivered', 'delivery_failed']
      },
      {
        id: 'picked_up',
        name: 'Picked Up',
        description: 'Order has been picked up by customer',
        color: '#059669',
        icon: 'hand-raised',
        isTerminal: true,
        allowedTransitions: []
      },
      {
        id: 'delivered',
        name: 'Delivered',
        description: 'Order has been successfully delivered',
        color: '#059669',
        icon: 'check-badge',
        isTerminal: true,
        allowedTransitions: []
      },
      {
        id: 'cancelled',
        name: 'Cancelled',
        description: 'Order has been cancelled',
        color: '#ef4444',
        icon: 'x-circle',
        isTerminal: true,
        allowedTransitions: []
      },
      {
        id: 'delayed',
        name: 'Delayed',
        description: 'Order preparation is delayed',
        color: '#f97316',
        icon: 'exclamation-triangle',
        isTerminal: false,
        allowedTransitions: ['preparing', 'ready', 'cancelled']
      },
      {
        id: 'delivery_failed',
        name: 'Delivery Failed',
        description: 'Delivery attempt failed',
        color: '#dc2626',
        icon: 'exclamation-circle',
        isTerminal: false,
        allowedTransitions: ['out_for_delivery', 'ready', 'cancelled']
      }
    ];
  }

  /**
   * Initialize workflow rules
   */
  private initializeWorkflowRules(): void {
    this.workflowRules = [
      {
        id: 'notify_customer_status_change',
        name: 'Notify Customer on Status Change',
        trigger: {
          event: 'status_change',
          conditions: { notifyCustomer: true }
        },
        actions: [
          {
            type: 'send_notification',
            parameters: {
              recipient: 'customer',
              channel: 'email',
              template: 'order_status_update'
            }
          }
        ],
        enabled: true
      },
      {
        id: 'auto_ready_after_preparation',
        name: 'Auto-mark Ready after Preparation Time',
        trigger: {
          event: 'time_elapsed',
          conditions: { 
            status: 'preparing',
            minutes: 30
          }
        },
        actions: [
          {
            type: 'update_status',
            parameters: { newStatus: 'ready' }
          },
          {
            type: 'send_notification',
            parameters: {
              recipient: 'staff',
              channel: 'in_app',
              message: 'Order ready for pickup/delivery'
            }
          }
        ],
        enabled: true
      },
      {
        id: 'delay_notification',
        name: 'Notify on Preparation Delay',
        trigger: {
          event: 'time_elapsed',
          conditions: {
            status: 'preparing',
            minutes: 45
          }
        },
        actions: [
          {
            type: 'update_status',
            parameters: { newStatus: 'delayed' }
          },
          {
            type: 'send_notification',
            parameters: {
              recipient: 'customer',
              channel: 'email',
              template: 'order_delayed'
            }
          }
        ],
        enabled: true
      }
    ];
  }

  /**
   * Update order status
   */
  public async updateOrderStatus(
    orderId: string,
    newStatus: string,
    performedBy: string,
    notes?: string
  ): Promise<OrderWorkflowStep> {
    try {
      // Validate status transition
      const currentOrder = await this.getOrder(orderId);
      const currentStatus = this.getOrderStatus(currentOrder.status);
      const newStatusObj = this.getOrderStatus(newStatus);

      if (!currentStatus || !newStatusObj) {
        throw new Error('Invalid status');
      }

      if (!currentStatus.allowedTransitions.includes(newStatus)) {
        throw new Error(`Cannot transition from ${currentStatus.name} to ${newStatusObj.name}`);
      }

      // Create workflow step
      const workflowStep: OrderWorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        status: newStatus,
        timestamp: new Date(),
        performedBy,
        notes,
        estimatedCompletion: this.calculateEstimatedCompletion(newStatus)
      };

      // Update order in storage/API
      if (process.env.NODE_ENV === 'development') {
        const orders = this.getStoredOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex >= 0) {
          orders[orderIndex].status = newStatus;
          orders[orderIndex].updatedAt = new Date();
          localStorage.setItem('orders', JSON.stringify(orders));
        }

        // Store workflow step
        const steps = this.getStoredWorkflowSteps();
        steps.push(workflowStep);
        localStorage.setItem('workflow_steps', JSON.stringify(steps));

        console.log('📋 Order Status Updated:', workflowStep);
      } else {
        const response = await fetch(`${this.apiBaseUrl}/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: newStatus,
            performedBy,
            notes
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
      }

      // Execute workflow rules
      await this.executeWorkflowRules('status_change', {
        orderId,
        oldStatus: currentOrder.status,
        newStatus,
        workflowStep
      });

      return workflowStep;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  /**
   * Get order workflow history
   */
  public async getOrderWorkflow(orderId: string): Promise<OrderWorkflowStep[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const steps = this.getStoredWorkflowSteps();
        return steps.filter(step => step.orderId === orderId);
      }

      const response = await fetch(`${this.apiBaseUrl}/orders/${orderId}/workflow`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get order workflow');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get order workflow:', error);
      return [];
    }
  }

  /**
   * Send order notification
   */
  public async sendOrderNotification(
    orderId: string,
    type: OrderNotification['type'],
    recipient: OrderNotification['recipient'],
    channel: OrderNotification['channel'] = 'email'
  ): Promise<OrderNotification> {
    try {
      const order = await this.getOrder(orderId);
      const notification: OrderNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        type,
        recipient,
        channel,
        sent: false
      };

      // Send notification based on channel
      if (channel === 'email' && recipient === 'customer') {
        try {
          await emailService.sendOrderStatusUpdate({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            newStatus: order.status,
            statusMessage: this.getStatusMessage(order.status)
          });

          notification.sent = true;
          notification.sentAt = new Date();
        } catch (error) {
          notification.error = (error as Error).message;
        }
      }

      // Store notification record
      if (process.env.NODE_ENV === 'development') {
        const notifications = this.getStoredNotifications();
        notifications.push(notification);
        localStorage.setItem('order_notifications', JSON.stringify(notifications));
        
        console.log('📧 Order Notification:', notification);
      }

      return notification;
    } catch (error) {
      console.error('Failed to send order notification:', error);
      throw error;
    }
  }

  /**
   * Execute workflow rules
   */
  private async executeWorkflowRules(
    event: string,
    context: Record<string, any>
  ): Promise<void> {
    const applicableRules = this.workflowRules.filter(
      rule => rule.enabled && rule.trigger.event === event
    );

    for (const rule of applicableRules) {
      try {
        // Check conditions
        if (this.evaluateConditions(rule.trigger.conditions, context)) {
          // Execute actions
          for (const action of rule.actions) {
            await this.executeWorkflowAction(action, context);
          }
        }
      } catch (error) {
        console.error(`Failed to execute workflow rule ${rule.name}:`, error);
      }
    }
  }

  /**
   * Execute workflow action
   */
  private async executeWorkflowAction(
    action: WorkflowAction,
    context: Record<string, any>
  ): Promise<void> {
    // Apply delay if specified
    if (action.delay && action.delay > 0) {
      setTimeout(async () => {
        await this.performAction(action, context);
      }, action.delay * 60 * 1000);
    } else {
      await this.performAction(action, context);
    }
  }

  /**
   * Perform workflow action
   */
  private async performAction(
    action: WorkflowAction,
    context: Record<string, any>
  ): Promise<void> {
    switch (action.type) {
      case 'send_notification':
        await this.sendOrderNotification(
          context.orderId,
          'status_change',
          action.parameters.recipient,
          action.parameters.channel
        );
        break;

      case 'update_status':
        await this.updateOrderStatus(
          context.orderId,
          action.parameters.newStatus,
          'system',
          'Automated status update'
        );
        break;

      case 'log_event':
        console.log('Workflow Event:', {
          orderId: context.orderId,
          event: action.parameters.event,
          timestamp: new Date()
        });
        break;

      default:
        console.warn('Unknown workflow action type:', action.type);
    }
  }

  /**
   * Helper methods
   */
  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    // Simple condition evaluation - in production this would be more sophisticated
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private calculateEstimatedCompletion(status: string): Date | undefined {
    const estimationMap: Record<string, number> = {
      'confirmed': 5, // 5 minutes to start preparation
      'preparing': 30, // 30 minutes to prepare
      'ready': 15, // 15 minutes for pickup/delivery
      'out_for_delivery': 20 // 20 minutes for delivery
    };

    const minutes = estimationMap[status];
    if (minutes) {
      return new Date(Date.now() + minutes * 60 * 1000);
    }
    return undefined;
  }

  private getStatusMessage(status: string): string {
    const statusObj = this.getOrderStatus(status);
    return statusObj ? statusObj.description : 'Status updated';
  }

  private getOrderStatus(statusId: string): OrderStatus | undefined {
    return this.orderStatuses.find(s => s.id === statusId);
  }

  private async getOrder(orderId: string): Promise<any> {
    // Mock order data for development
    return {
      id: orderId,
      orderNumber: `ORD-${orderId}`,
      status: 'confirmed',
      customerEmail: 'customer@example.com',
      customerName: 'John Doe',
      updatedAt: new Date()
    };
  }

  private getStoredOrders(): any[] {
    try {
      const stored = localStorage.getItem('orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private getStoredWorkflowSteps(): OrderWorkflowStep[] {
    try {
      const stored = localStorage.getItem('workflow_steps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private getStoredNotifications(): OrderNotification[] {
    try {
      const stored = localStorage.getItem('order_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Public getters
   */
  public getOrderStatuses(): OrderStatus[] {
    return this.orderStatuses;
  }

  public getWorkflowRules(): WorkflowRule[] {
    return this.workflowRules;
  }
}

export const orderWorkflowService = OrderWorkflowService.getInstance();