import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private emailService: EmailService,
  ) {}

  // Restaurant table booking management
  async findAllBookings(query: BookingQueryDto, user?: User) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate, 
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = query;
    
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.restaurantTable', 'table');
    
    // If not admin, only show user's own bookings
    if (user && user.role !== 'admin') {
      queryBuilder.andWhere('booking.userId = :userId', { userId: user.id });
    }
    
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }
    
    if (startDate) {
      queryBuilder.andWhere('booking.bookingDate >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('booking.bookingDate <= :endDate', { endDate });
    }
    
    queryBuilder
      .orderBy(`booking.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);
    
    const [bookings, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBookingById(id: string, user?: User) {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.restaurantTable', 'table')
      .where('booking.id = :id', { id });

    // If not admin, only allow access to own bookings
    if (user && user.role !== 'admin') {
      queryBuilder.andWhere('booking.userId = :userId', { userId: user.id });
    }

    const booking = await queryBuilder.getOne();
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async createBooking(createBookingDto: CreateBookingDto, user?: User) {
    // Validate booking date is not in the past
    const bookingDate = new Date(createBookingDto.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      throw new BadRequestException('Cannot book a table for a past date');
    }

    // Check for table conflicts if a specific table is requested
    if (createBookingDto.restaurantTableId) {
      const conflictingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.restaurantTableId = :tableId', { tableId: createBookingDto.restaurantTableId })
        .andWhere('booking.status IN (:...statuses)', { 
          statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING] 
        })
        .andWhere('DATE(booking.bookingDate) = :date', { date: createBookingDto.bookingDate })
        .andWhere('booking.bookingTime = :time', { time: createBookingDto.bookingTime })
        .getCount();

      if (conflictingBookings > 0) {
        throw new BadRequestException('This table is already booked for the selected date and time');
      }
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId: user?.id,
      status: BookingStatus.PENDING,
      bookingNumber: `BK-${Date.now()}`,
    });
    
    const savedBooking = await this.bookingRepository.save(booking);
    
    // Send confirmation email
    if (savedBooking.customerEmail) {
      await this.emailService.sendBookingConfirmation(savedBooking);
    }
    
    return savedBooking;
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto, user?: User) {
    const booking = await this.findBookingById(id, user);
    
    Object.assign(booking, updateBookingDto);
    
    const updatedBooking = await this.bookingRepository.save(booking);
    
    // Send status update email if status changed
    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      await this.emailService.sendBookingStatusUpdate(updatedBooking);
    }
    
    return updatedBooking;
  }

  async cancelBooking(id: string, user?: User) {
    const booking = await this.findBookingById(id, user);
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }
    
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    
    const cancelledBooking = await this.bookingRepository.save(booking);
    
    // Send cancellation email
    await this.emailService.sendBookingCancellation(cancelledBooking);
    
    return cancelledBooking;
  }

  async getBookingStats() {
    const totalBookings = await this.bookingRepository.count();
    const confirmedBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.CONFIRMED }
    });
    const pendingBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.PENDING }
    });
    const cancelledBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.CANCELLED }
    });

    return {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
    };
  }

  // Admin methods
  async getAdminBookings() {
    const bookings = await this.bookingRepository.find({
      relations: ['user', 'restaurantTable'],
      order: { createdAt: 'DESC' }
    });

    return {
      bookings,
      total: bookings.length
    };
  }
}