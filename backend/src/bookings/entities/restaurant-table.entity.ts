import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tableNumber: string;

  @Column('int')
  capacity: number;

  @Column({ nullable: true })
  location: string; // e.g., 'window', 'patio', 'main dining'

  @Column({ default: 'available' })
  status: string; // available, occupied, reserved, maintenance

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => Booking, booking => booking.restaurantTable)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}