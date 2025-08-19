import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';

@Module({
  providers: [MonitoringService, LoggerService, MetricsService],
  controllers: [MonitoringController],
  exports: [MonitoringService, LoggerService, MetricsService],
})
export class MonitoringModule {}