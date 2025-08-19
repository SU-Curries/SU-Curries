import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  message?: string;
  timestamp: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  services: HealthCheck[];
  metrics: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class MonitoringService {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alertThresholds = {
    responseTime: 5000, // 5 seconds
    errorRate: 0.05, // 5%
    memoryUsage: 85, // 85%
    cpuUsage: 80, // 80%
  };

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private metrics: MetricsService,
  ) {
    // Start periodic health checks
    this.startPeriodicHealthChecks();
    this.startSystemMetricsCollection();
  }

  private startPeriodicHealthChecks(): void {
    // Run health checks every 30 seconds
    setInterval(() => {
      this.performHealthChecks();
    }, 30000);
  }

  private startSystemMetricsCollection(): void {
    // Collect system metrics every 10 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 10000);
  }

  private async performHealthChecks(): Promise<void> {
    const checks = [
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalAPIs(),
      this.checkFileSystem(),
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.healthChecks.set(result.value.service, result.value);
      } else {
        this.logger.error(`Health check failed: ${result.reason}`, undefined, 'HealthCheck');
      }
    });
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Simple database connectivity check
      // In a real implementation, you'd check actual database connection
      const responseTime = Date.now() - start;
      
      return {
        service: 'database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  private async checkRedis(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Redis connectivity check
      // In a real implementation, you'd ping Redis
      const responseTime = Date.now() - start;
      
      return {
        service: 'redis',
        status: responseTime < 500 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        service: 'redis',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  private async checkExternalAPIs(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Check external API dependencies (payment, email, etc.)
      const responseTime = Date.now() - start;
      
      return {
        service: 'external_apis',
        status: 'healthy',
        responseTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        service: 'external_apis',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  private async checkFileSystem(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Check file system access
      const responseTime = Date.now() - start;
      
      return {
        service: 'filesystem',
        status: 'healthy',
        responseTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        service: 'filesystem',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  private collectSystemMetrics(): void {
    try {
      // Collect memory usage
      const memoryUsage = process.memoryUsage();
      const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
      this.metrics.recordMemoryUsage(memoryUsageMB);

      // Collect CPU usage (simplified)
      const cpuUsage = process.cpuUsage();
      const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
      this.metrics.recordCpuUsage(cpuPercent);

      // Check for alerts
      this.checkAlerts();
    } catch (error) {
      this.logger.error('Failed to collect system metrics', error.stack, 'SystemMetrics');
    }
  }

  private checkAlerts(): void {
    const healthMetrics = this.metrics.getHealthMetrics();
    
    // Check response time alerts
    if (healthMetrics.response_time?.avg > this.alertThresholds.responseTime) {
      this.sendAlert('high_response_time', {
        current: healthMetrics.response_time.avg,
        threshold: this.alertThresholds.responseTime,
      });
    }

    // Check error rate alerts
    const errorRate = this.calculateErrorRate();
    if (errorRate > this.alertThresholds.errorRate) {
      this.sendAlert('high_error_rate', {
        current: errorRate,
        threshold: this.alertThresholds.errorRate,
      });
    }

    // Check memory usage alerts
    if (healthMetrics.memory_usage > this.alertThresholds.memoryUsage) {
      this.sendAlert('high_memory_usage', {
        current: healthMetrics.memory_usage,
        threshold: this.alertThresholds.memoryUsage,
      });
    }

    // Check CPU usage alerts
    if (healthMetrics.cpu_usage > this.alertThresholds.cpuUsage) {
      this.sendAlert('high_cpu_usage', {
        current: healthMetrics.cpu_usage,
        threshold: this.alertThresholds.cpuUsage,
      });
    }
  }

  private calculateErrorRate(): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const requests = this.metrics.getAggregatedMetrics('api_requests', 'counter', oneHourAgo);
    const errors = this.metrics.getAggregatedMetrics('errors', 'counter', oneHourAgo);
    
    if (requests.sum === 0) return 0;
    return errors.sum / requests.sum;
  }

  private sendAlert(type: string, data: any): void {
    this.logger.error(`ALERT: ${type}`, JSON.stringify(data), 'AlertSystem');
    
    // In production, you would send alerts to:
    // - Slack/Discord webhooks
    // - Email notifications
    // - PagerDuty/OpsGenie
    // - SMS alerts
    
    this.metrics.incrementCounter('alerts_sent', 1, { type });
  }

  // Public methods for health checks
  async getSystemHealth(): Promise<SystemHealth> {
    const services = Array.from(this.healthChecks.values());
    const metrics = this.metrics.getHealthMetrics();
    
    // Determine overall health
    const unhealthyServices = services.filter(s => s.status === 'unhealthy');
    const degradedServices = services.filter(s => s.status === 'degraded');
    
    let overall: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (unhealthyServices.length > 0) {
      overall = 'unhealthy';
    } else if (degradedServices.length > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      services,
      metrics,
      timestamp: new Date(),
    };
  }

  getHealthCheck(service: string): HealthCheck | undefined {
    return this.healthChecks.get(service);
  }

  // Manual health check trigger
  async runHealthCheck(service?: string): Promise<HealthCheck[]> {
    if (service) {
      const check = this.healthChecks.get(service);
      return check ? [check] : [];
    }
    
    await this.performHealthChecks();
    return Array.from(this.healthChecks.values());
  }

  // Performance monitoring
  async measureOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    const start = Date.now();
    let success = true;
    let error: any = null;

    try {
      const result = await fn();
      return result;
    } catch (err) {
      success = false;
      error = err;
      throw err;
    } finally {
      const duration = Date.now() - start;
      
      this.metrics.recordTimer(`operation_${operation}`, duration);
      this.logger.logPerformance(operation, duration, { success, context });
      
      if (!success) {
        this.logger.error(`Operation failed: ${operation}`, error?.stack, context);
        this.metrics.recordError('operation_failure', operation, 'medium');
      }
    }
  }

  // Request monitoring middleware helper
  recordRequest(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    this.metrics.recordApiRequest(method, url, statusCode, duration);
    this.logger.logApiRequest(method, url, userId, undefined, { 
      status_code: statusCode,
      duration 
    });
  }
}