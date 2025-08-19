import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getDashboardKPIs(period: string = '7days') {
    const { startDate, endDate } = this.getDateRange(period);
    
    const [totalRevenue, orderCount, userCount, conversionData] = await Promise.all([
      this.getTotalRevenue(startDate, endDate),
      this.getOrderCount(startDate, endDate),
      this.getUserCount(startDate, endDate),
      this.getConversionRate(startDate, endDate)
    ]);

    return {
      totalRevenue,
      orderCount,
      userCount,
      conversionRate: conversionData.rate,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
    };
  }

  async getSalesAnalytics(period: string = '30days') {
    const { startDate, endDate } = this.getDateRange(period);
    
    const salesTrend = await this.getSalesTrend(startDate, endDate);
    const topProducts = await this.getTopProducts(startDate, endDate);
    const categoryPerformance = await this.getCategoryPerformance(startDate, endDate);
    
    return { salesTrend, topProducts, categoryPerformance };
  }

  async getCustomerAnalytics(period: string = '30days') {
    const { startDate, endDate } = this.getDateRange(period);
    
    const customerAcquisition = await this.getCustomerAcquisition(startDate, endDate);
    const customerRetention = await this.getCustomerRetention(startDate, endDate);
    const topCustomers = await this.getTopCustomers(startDate, endDate);
    
    return { customerAcquisition, customerRetention, topCustomers };
  }

  private async getTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }

  private async getOrderCount(startDate: Date, endDate: Date): Promise<number> {
    return this.orderRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  private async getUserCount(startDate: Date, endDate: Date): Promise<number> {
    return this.userRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  private async getConversionRate(startDate: Date, endDate: Date): Promise<{ rate: number }> {
    const totalUsers = await this.userRepository.count();
    const ordersCount = await this.getOrderCount(startDate, endDate);
    
    return {
      rate: totalUsers > 0 ? (ordersCount / totalUsers) * 100 : 0,
    };
  }

  private async getSalesTrend(startDate: Date, endDate: Date) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'date')
      .addSelect('SUM(order.total)', 'revenue')
      .addSelect('COUNT(*)', 'orders')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(order.createdAt)')
      .orderBy('DATE(order.createdAt)', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      revenue: parseFloat(row.revenue || '0'),
      orders: parseInt(row.orders || '0'),
    }));
  }

  private async getTopProducts(startDate: Date, endDate: Date, limit: number = 10) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.quantity * item.price)', 'totalRevenue')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('product.id')
      .orderBy('SUM(item.quantity * item.price)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      productId: row.productId,
      name: row.productName,
      totalSold: parseInt(row.totalSold || '0'),
      revenue: parseFloat(row.totalRevenue || '0'),
    }));
  }

  private async getCategoryPerformance(startDate: Date, endDate: Date) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select('product.category', 'category')
      .addSelect('SUM(item.quantity * item.price)', 'revenue')
      .addSelect('COUNT(DISTINCT order.id)', 'orders')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('product.category')
      .orderBy('SUM(item.quantity * item.price)', 'DESC')
      .getRawMany();

    return result.map(row => ({
      category: row.category,
      revenue: parseFloat(row.revenue || '0'),
      orders: parseInt(row.orders || '0'),
    }));
  }

  private async getCustomerAcquisition(startDate: Date, endDate: Date) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.createdAt)', 'date')
      .addSelect('COUNT(*)', 'newCustomers')
      .where('user.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(user.createdAt)')
      .orderBy('DATE(user.createdAt)', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      newCustomers: parseInt(row.newCustomers || '0'),
    }));
  }

  private async getCustomerRetention(startDate: Date, endDate: Date) {
    // Simplified retention calculation
    const totalCustomers = await this.userRepository.count();
    const activeCustomers = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(DISTINCT order.userId)', 'count')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return {
      retentionRate: totalCustomers > 0 ? (parseInt(activeCustomers?.count || '0') / totalCustomers) * 100 : 0,
    };
  }

  private async getTopCustomers(startDate: Date, endDate: Date, limit: number = 10) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .select('user.id', 'userId')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .addSelect('user.email', 'email')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('SUM(order.total)', 'totalSpent')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('user.id')
      .orderBy('SUM(order.total)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      userId: row.userId,
      name: `${row.firstName} ${row.lastName}`,
      email: row.email,
      orderCount: parseInt(row.orderCount || '0'),
      totalSpent: parseFloat(row.totalSpent || '0'),
    }));
  }

  private getDateRange(period: string): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    return { startDate, endDate };
  }
}