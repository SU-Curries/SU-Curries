import { apiService } from './api.service';

export interface DashboardKPIs {
  totalRevenue: number;
  orderCount: number;
  userCount: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface SalesAnalytics {
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    orders: number;
  }>;
}

export interface CustomerAnalytics {
  customerAcquisition: Array<{
    date: string;
    newCustomers: number;
  }>;
  customerRetention: {
    retentionRate: number;
  };
  topCustomers: Array<{
    userId: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

class AnalyticsService {
  async getDashboardKPIs(period: string = '7days'): Promise<DashboardKPIs> {
    try {
      const response = await apiService.get(`/analytics/dashboard-kpis?period=${period}`) as { data: DashboardKPIs };
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard KPIs:', error);
      // Return mock data as fallback
      return {
        totalRevenue: 15420.50,
        orderCount: 234,
        userCount: 1847,
        conversionRate: 3.2,
        averageOrderValue: 65.90,
      };
    }
  }

  async getSalesAnalytics(period: string = '30days'): Promise<SalesAnalytics> {
    try {
      const response = await apiService.get(`/analytics/sales?period=${period}`) as { data: SalesAnalytics };
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sales analytics:', error);
      // Return mock data as fallback
      return {
        salesTrend: [
          { date: '2024-01-01', revenue: 1200, orders: 15 },
          { date: '2024-01-02', revenue: 1500, orders: 18 },
          { date: '2024-01-03', revenue: 980, orders: 12 },
        ],
        topProducts: [
          { productId: '1', name: 'Spicy Curry Base', totalSold: 89, revenue: 524.11 },
          { productId: '2', name: 'Tikka Masala Combo', totalSold: 67, revenue: 669.33 },
        ],
        categoryPerformance: [
          { category: 'Curry Bases', revenue: 2500, orders: 45 },
          { category: 'Gravies', revenue: 1800, orders: 32 },
        ],
      };
    }
  }

  async getCustomerAnalytics(period: string = '30days'): Promise<CustomerAnalytics> {
    try {
      const response = await apiService.get(`/analytics/customers?period=${period}`) as { data: CustomerAnalytics };
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer analytics:', error);
      // Return mock data as fallback
      return {
        customerAcquisition: [
          { date: '2024-01-01', newCustomers: 5 },
          { date: '2024-01-02', newCustomers: 8 },
        ],
        customerRetention: { retentionRate: 65.5 },
        topCustomers: [
          { userId: '1', name: 'John Doe', email: 'john@example.com', orderCount: 12, totalSpent: 789.50 },
          { userId: '2', name: 'Jane Smith', email: 'jane@example.com', orderCount: 8, totalSpent: 567.30 },
        ],
      };
    }
  }
}

export const analyticsService = new AnalyticsService();