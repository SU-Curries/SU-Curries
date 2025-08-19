import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MonitoringController {
  constructor(
    private monitoringService: MonitoringService,
    private metricsService: MetricsService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health information' })
  @Roles('admin')
  async getHealth() {
    return await this.monitoringService.getSystemHealth();
  }

  @Get('health/service')
  @ApiOperation({ summary: 'Get specific service health' })
  @ApiResponse({ status: 200, description: 'Service health information' })
  @Roles('admin')
  async getServiceHealth(@Query('service') service: string) {
    return this.monitoringService.getHealthCheck(service);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get system metrics' })
  @ApiResponse({ status: 200, description: 'System metrics data' })
  @Roles('admin')
  async getMetrics(
    @Query('name') name?: string,
    @Query('type') type?: string,
    @Query('since') since?: string,
  ) {
    const sinceDate = since ? new Date(since) : undefined;
    return this.metricsService.getMetrics(name, type, sinceDate);
  }

  @Get('metrics/aggregated')
  @ApiOperation({ summary: 'Get aggregated metrics' })
  @ApiResponse({ status: 200, description: 'Aggregated metrics data' })
  @Roles('admin')
  async getAggregatedMetrics(
    @Query('name') name: string,
    @Query('type') type: string,
    @Query('since') since?: string,
  ) {
    const sinceDate = since ? new Date(since) : undefined;
    return this.metricsService.getAggregatedMetrics(name, type, sinceDate);
  }

  @Get('metrics/health')
  @ApiOperation({ summary: 'Get health metrics summary' })
  @ApiResponse({ status: 200, description: 'Health metrics summary' })
  @Roles('admin')
  async getHealthMetrics() {
    return this.metricsService.getHealthMetrics();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  @Roles('admin')
  async getPerformanceMetrics(@Query('hours') hours: string = '24') {
    const hoursAgo = new Date(Date.now() - parseInt(hours) * 60 * 60 * 1000);
    
    return {
      api_response_times: this.metricsService.getAggregatedMetrics('api_response_time', 'timer', hoursAgo),
      database_query_times: this.metricsService.getAggregatedMetrics('database_query_time', 'timer', hoursAgo),
      error_rates: this.metricsService.getAggregatedMetrics('errors', 'counter', hoursAgo),
      request_counts: this.metricsService.getAggregatedMetrics('api_requests', 'counter', hoursAgo),
    };
  }

  @Get('business')
  @ApiOperation({ summary: 'Get business metrics' })
  @ApiResponse({ status: 200, description: 'Business metrics' })
  @Roles('admin')
  async getBusinessMetrics(@Query('days') days: string = '7') {
    const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    return {
      user_registrations: this.metricsService.getAggregatedMetrics('user_registrations', 'counter', daysAgo),
      user_logins: this.metricsService.getAggregatedMetrics('user_logins', 'counter', daysAgo),
      orders_placed: this.metricsService.getAggregatedMetrics('orders_placed', 'counter', daysAgo),
      product_views: this.metricsService.getAggregatedMetrics('product_views', 'counter', daysAgo),
      cart_actions: this.metricsService.getAggregatedMetrics('cart_actions', 'counter', daysAgo),
      bookings_created: this.metricsService.getAggregatedMetrics('bookings_created', 'counter', daysAgo),
    };
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get recent alerts' })
  @ApiResponse({ status: 200, description: 'Recent alerts' })
  @Roles('admin')
  async getAlerts(@Query('hours') hours: string = '24') {
    const hoursAgo = new Date(Date.now() - parseInt(hours) * 60 * 60 * 1000);
    return this.metricsService.getAggregatedMetrics('alerts_sent', 'counter', hoursAgo);
  }
}