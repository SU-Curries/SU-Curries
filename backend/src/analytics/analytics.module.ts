import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, Booking])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}