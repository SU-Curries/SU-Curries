import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { RestaurantTablesService } from './restaurant-tables.service';
import { RestaurantTablesController } from './restaurant-tables.controller';
import { Booking } from './entities/booking.entity';
import { RestaurantTable } from './entities/restaurant-table.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, RestaurantTable]),
    EmailModule,
  ],
  controllers: [BookingsController, RestaurantTablesController],
  providers: [BookingsService, RestaurantTablesService],
  exports: [BookingsService, RestaurantTablesService],
})
export class BookingsModule {}