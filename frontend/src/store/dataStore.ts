import { Order, OrderStatus } from '../services/order.service';
import { extensiveMockOrders, mockUsers } from '../data/extensiveMockData';

// Centralized data store for orders
class DataStore {
  private static instance: DataStore;
  private orders: Order[] = [...extensiveMockOrders];
  private users: any[] = [...mockUsers];
  private listeners: (() => void)[] = [];
  private currentUserId: string | null = null;

  private constructor() {}

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // Subscribe to data changes
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of changes
  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // Get all orders
  public getOrders(): Order[] {
    return [...this.orders];
  }

  // Set current user
  public setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  // Get current user
  public getCurrentUser(): any | null {
    if (!this.currentUserId) return null;
    return this.users.find(user => user.id === this.currentUserId) || null;
  }

  // Get orders for a specific user
  public getUserOrders(userId?: string): Order[] {
    const targetUserId = userId || this.currentUserId;
    if (!targetUserId) return [];
    
    // Return only orders belonging to the specific user
    return this.orders.filter(order => order.userId === targetUserId);
  }

  // Get order by ID
  public getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  // Add new order
  public addOrder(order: Order): void {
    this.orders.unshift(order); // Add to beginning
    this.notify();
  }

  // Update order status
  public updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      this.notify();
      return true;
    }
    return false;
  }

  // Update entire order
  public updateOrder(orderId: string, updates: Partial<Order>): boolean {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.notify();
      return true;
    }
    return false;
  }

  // Delete order
  public deleteOrder(orderId: string): boolean {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter(order => order.id !== orderId);
    if (this.orders.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  }

  // Get orders by status
  public getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  // Get orders for delivery (shipped status)
  public getOrdersForDelivery(): Order[] {
    return this.orders.filter(order => order.status === 'shipped');
  }

  // Mark order as delivered
  public markOrderAsDelivered(orderId: string, deliveryNotes?: string): boolean {
    return this.updateOrder(orderId, {
      status: 'delivered',
      notes: deliveryNotes ? `${deliveryNotes}` : undefined
    });
  }

  // User management methods
  public getUsers(): any[] {
    return [...this.users];
  }

  public getUserById(userId: string): any | null {
    return this.users.find(user => user.id === userId) || null;
  }

  public authenticateUser(email: string, password: string): any | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.setCurrentUser(user.id);
      return user;
    }
    return null;
  }

  // Analytics methods
  public getOrderStats(): any {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const thisMonthOrders = this.orders.filter(order => new Date(order.createdAt) >= thisMonth);
    const lastMonthOrders = this.orders.filter(order => 
      new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) < thisMonth
    );
    
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      totalOrders: this.orders.length,
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      totalRevenue: this.orders.reduce((sum, order) => sum + order.totalAmount, 0),
      thisMonthRevenue,
      lastMonthRevenue,
      averageOrderValue: this.orders.length > 0 ? 
        this.orders.reduce((sum, order) => sum + order.totalAmount, 0) / this.orders.length : 0,
      pendingOrders: this.orders.filter(order => order.status === 'pending').length,
      processingOrders: this.orders.filter(order => order.status === 'processing').length,
      shippedOrders: this.orders.filter(order => order.status === 'shipped').length,
      deliveredOrders: this.orders.filter(order => order.status === 'delivered').length,
      cancelledOrders: this.orders.filter(order => order.status === 'cancelled').length
    };
  }
}

export const dataStore = DataStore.getInstance();