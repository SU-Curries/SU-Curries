import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RestaurantTable } from './restaurant-table.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingNumber: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: BookingStatus;

  @Column()
  bookingDate: Date;

  @Column()
  bookingTime: string; // Format: "19:30"

  @Column()
  guestCount: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  tableNumber: string;

  @Column({ default: false })
  isVip: boolean;

  @Column({ nullable: true })
  confirmationSentAt: Date;

  @Column({ nullable: true })
  reminderSentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  // Additional properties for restaurant table bookings
  @Column({ nullable: true })
  restaurantTableId: string;

  @Column({ nullable: true })
  partySize: number; // Number of guests

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ nullable: true })
  cancelledAt: Date;

  // Relation to restaurant table
  @ManyToOne(() => RestaurantTable, (table) => table.bookings, { nullable: true })
  @JoinColumn({ name: 'restaurantTableId' })
  restaurantTable: RestaurantTable;



  // Computed properties
  get bookingDateTime(): Date {
    const [hours, minutes] = this.bookingTime.split(':').map(Number);
    const dateTime = new Date(this.bookingDate);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  get isPastBooking(): boolean {
    return this.bookingDateTime < new Date();
  }

  get canBeCancelled(): boolean {
    const now = new Date();
    const bookingTime = this.bookingDateTime;
    const hoursDifference = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.CONFIRMED
    ) && hoursDifference > 2; // Can cancel up to 2 hours before
  }
}