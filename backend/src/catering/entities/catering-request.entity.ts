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

export enum CateringStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  QUOTED = 'quoted',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EventType {
  CORPORATE = 'corporate',
  WEDDING = 'wedding',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  RELIGIOUS = 'religious',
  OTHER = 'other',
}

@Entity('catering_requests')
export class CateringRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  requestNumber: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: CateringStatus;

  @Column({
    type: 'varchar',
  })
  eventType: EventType;

  @Column()
  eventDate: Date;

  @Column()
  eventTime: string;

  @Column()
  guestCount: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column({ type: 'json' })
  eventAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @Column({ type: 'text' })
  eventDetails: string;

  @Column({ nullable: true })
  budgetRange: string;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ type: 'text', nullable: true })
  dietaryRestrictions: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quotedAmount: number;

  @Column({ type: 'text', nullable: true })
  quotedDetails: string;

  @Column({ nullable: true })
  quotedAt: Date;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.cateringRequests, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  // Computed properties
  get eventDateTime(): Date {
    const [hours, minutes] = this.eventTime.split(':').map(Number);
    const dateTime = new Date(this.eventDate);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  get isPastEvent(): boolean {
    return this.eventDateTime < new Date();
  }

  get daysUntilEvent(): number {
    const now = new Date();
    const eventTime = this.eventDateTime;
    const timeDifference = eventTime.getTime() - now.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }
}