import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from './entities/restaurant-table.entity';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';

@Injectable()
export class RestaurantTablesService {
  constructor(
    @InjectRepository(RestaurantTable)
    private tableRepository: Repository<RestaurantTable>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findAll() {
    return await this.tableRepository.find({
      where: { isActive: true },
      order: { tableNumber: 'ASC' },
    });
  }

  async findOne(id: string) {
    const table = await this.tableRepository.findOne({
      where: { id, isActive: true },
      relations: ['bookings'],
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async create(createTableDto: CreateRestaurantTableDto) {
    // Check if table number already exists
    const existingTable = await this.tableRepository.findOne({
      where: { tableNumber: createTableDto.tableNumber }
    });

    if (existingTable) {
      throw new BadRequestException(`Table number ${createTableDto.tableNumber} already exists`);
    }

    const table = this.tableRepository.create(createTableDto);
    return await this.tableRepository.save(table);
  }

  async update(id: string, updateTableDto: UpdateRestaurantTableDto) {
    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    // Check if table number is being changed and if it already exists
    if (updateTableDto.tableNumber && updateTableDto.tableNumber !== table.tableNumber) {
      const existingTable = await this.tableRepository.findOne({
        where: { tableNumber: updateTableDto.tableNumber }
      });

      if (existingTable) {
        throw new BadRequestException(`Table number ${updateTableDto.tableNumber} already exists`);
      }
    }

    Object.assign(table, updateTableDto);
    return await this.tableRepository.save(table);
  }

  async remove(id: string) {
    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    // Check if table has active bookings
    const activeBookings = await this.bookingRepository.count({
      where: {
        restaurantTableId: id,
        status: BookingStatus.CONFIRMED
      }
    });

    if (activeBookings > 0) {
      throw new BadRequestException('Cannot delete table with active bookings');
    }

    // Soft delete by setting isActive to false
    table.isActive = false;
    return await this.tableRepository.save(table);
  }

  async getAvailableTables(date: string, time: string, partySize: number) {
    const bookingDateTime = new Date(`${date}T${time}`);
    
    // Get all tables that can accommodate the party size
    const suitableTables = await this.tableRepository.find({
      where: {
        isActive: true,
        status: 'available',
        capacity: partySize // This should be >= partySize, but TypeORM doesn't support >= in simple where
      }
    });

    // Filter tables that have capacity >= partySize
    const tablesWithCapacity = suitableTables.filter(table => table.capacity >= partySize);

    // Check availability for each table
    const availableTables = [];
    
    for (const table of tablesWithCapacity) {
      const conflictingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.restaurantTableId = :tableId', { tableId: table.id })
        .andWhere('booking.status IN (:...statuses)', { 
          statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING] 
        })
        .andWhere('DATE(booking.bookingDate) = :date', { date })
        .andWhere('booking.bookingTime = :time', { time })
        .getCount();

      if (conflictingBookings === 0) {
        availableTables.push(table);
      }
    }

    return availableTables;
  }

  async getTableBookings(tableId: string, date?: string) {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.restaurantTableId = :tableId', { tableId })
      .orderBy('booking.bookingDate', 'DESC')
      .addOrderBy('booking.bookingTime', 'ASC');

    if (date) {
      queryBuilder.andWhere('booking.bookingDate = :date', { date });
    }

    return await queryBuilder.getMany();
  }

  async getTableStats() {
    const totalTables = await this.tableRepository.count({
      where: { isActive: true }
    });

    const availableTables = await this.tableRepository.count({
      where: { isActive: true, status: 'available' }
    });

    const occupiedTables = await this.tableRepository.count({
      where: { isActive: true, status: 'occupied' }
    });

    const totalCapacity = await this.tableRepository
      .createQueryBuilder('table')
      .select('SUM(table.capacity)', 'total')
      .where('table.isActive = :isActive', { isActive: true })
      .getRawOne();

    return {
      totalTables,
      availableTables,
      occupiedTables,
      totalCapacity: parseInt(totalCapacity.total) || 0,
    };
  }
}