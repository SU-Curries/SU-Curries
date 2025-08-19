import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-kpis')
  async getDashboardKPIs(@Query('period') period?: string) {
    return this.analyticsService.getDashboardKPIs(period);
  }

  @Get('sales')
  async getSalesAnalytics(@Query('period') period?: string) {
    return this.analyticsService.getSalesAnalytics(period);
  }

  @Get('customers')
  async getCustomerAnalytics(@Query('period') period?: string) {
    return this.analyticsService.getCustomerAnalytics(period);
  }
}