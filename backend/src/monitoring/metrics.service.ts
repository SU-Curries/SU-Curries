import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  errorType?: string;
}

@Injectable()
export class MetricsService {
  private metrics: Map<string, Metric[]> = new Map();
  private readonly maxMetricsPerType = 1000;

  constructor(private configService: ConfigService) {}

  // Counter metrics
  incrementCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.addMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
      type: 'counter',
    });
  }

  // Gauge metrics (current value)
  setGauge(name: string, value: number, tags?: Record<string, string>): void {
    this.addMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
      type: 'gauge',
    });
  }

  // Timer metrics
  recordTimer(name: string, duration: number, tags?: Record<string, string>): void {
    this.addMetric({
      name,
      value: duration,
      timestamp: new Date(),
      tags,
      type: 'timer',
    });
  }

  // Histogram metrics
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {
    this.addMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
      type: 'histogram',
    });
  }

  private addMetric(metric: Metric): void {
    const key = `${metric.name}_${metric.type}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key)!;
    metrics.push(metric);
    
    // Keep only recent metrics to prevent memory issues
    if (metrics.length > this.maxMetricsPerType) {
      metrics.splice(0, metrics.length - this.maxMetricsPerType);
    }
  }

  // Business metrics
  recordUserRegistration(source?: string): void {
    this.incrementCounter('user_registrations', 1, { source: source || 'direct' });
  }

  recordUserLogin(success: boolean, method?: string): void {
    this.incrementCounter('user_logins', 1, { 
      success: success.toString(),
      method: method || 'email'
    });
  }

  recordOrderPlaced(amount: number, currency: string = 'USD'): void {
    this.incrementCounter('orders_placed', 1);
    this.recordHistogram('order_amount', amount, { currency });
  }

  recordProductView(productId: string, category?: string): void {
    this.incrementCounter('product_views', 1, { 
      product_id: productId,
      category: category || 'unknown'
    });
  }

  recordCartAction(action: 'add' | 'remove' | 'update', productId: string): void {
    this.incrementCounter('cart_actions', 1, { 
      action,
      product_id: productId
    });
  }

  recordBookingCreated(type: 'table' | 'class', success: boolean): void {
    this.incrementCounter('bookings_created', 1, { 
      type,
      success: success.toString()
    });
  }

  // Performance metrics
  recordApiRequest(method: string, endpoint: string, statusCode: number, duration: number): void {
    this.incrementCounter('api_requests', 1, { 
      method,
      endpoint,
      status_code: statusCode.toString()
    });
    this.recordTimer('api_response_time', duration, { 
      method,
      endpoint
    });
  }

  recordDatabaseQuery(operation: string, table: string, duration: number, success: boolean): void {
    this.incrementCounter('database_queries', 1, { 
      operation,
      table,
      success: success.toString()
    });
    this.recordTimer('database_query_time', duration, { 
      operation,
      table
    });
  }

  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string): void {
    this.incrementCounter('cache_operations', 1, { 
      operation,
      key_type: this.getCacheKeyType(key)
    });
  }

  private getCacheKeyType(key: string): string {
    if (key.startsWith('user:')) return 'user';
    if (key.startsWith('product:')) return 'product';
    if (key.startsWith('order:')) return 'order';
    return 'other';
  }

  // Error metrics
  recordError(type: string, operation: string, severity: 'low' | 'medium' | 'high' | 'critical'): void {
    this.incrementCounter('errors', 1, { 
      type,
      operation,
      severity
    });
  }

  // System metrics
  recordMemoryUsage(usage: number): void {
    this.setGauge('memory_usage_mb', usage);
  }

  recordCpuUsage(usage: number): void {
    this.setGauge('cpu_usage_percent', usage);
  }

  recordActiveConnections(count: number): void {
    this.setGauge('active_connections', count);
  }

  // Get metrics for reporting
  getMetrics(name?: string, type?: string, since?: Date): Metric[] {
    const allMetrics: Metric[] = [];
    
    for (const [key, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(metric => {
        if (name && metric.name !== name) return false;
        if (type && metric.type !== type) return false;
        if (since && metric.timestamp < since) return false;
        return true;
      });
      
      allMetrics.push(...filteredMetrics);
    }
    
    return allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get aggregated metrics
  getAggregatedMetrics(name: string, type: string, since?: Date): {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
  } {
    const metrics = this.getMetrics(name, type, since);
    
    if (metrics.length === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
    }
    
    const values = metrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: metrics.length,
      sum,
      avg: sum / metrics.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThan: Date): void {
    for (const [key, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(m => m.timestamp >= olderThan);
      this.metrics.set(key, filteredMetrics);
    }
  }

  // Get system health metrics
  getHealthMetrics(): Record<string, any> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    return {
      api_requests: this.getAggregatedMetrics('api_requests', 'counter', oneHourAgo),
      errors: this.getAggregatedMetrics('errors', 'counter', oneHourAgo),
      response_time: this.getAggregatedMetrics('api_response_time', 'timer', oneHourAgo),
      memory_usage: this.getMetrics('memory_usage_mb', 'gauge').slice(0, 1)[0]?.value || 0,
      cpu_usage: this.getMetrics('cpu_usage_percent', 'gauge').slice(0, 1)[0]?.value || 0,
      active_connections: this.getMetrics('active_connections', 'gauge').slice(0, 1)[0]?.value || 0,
    };
  }
}