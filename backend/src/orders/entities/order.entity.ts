import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: OrderStatus;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  currency: string;

  // Customer information
  @Column()
  customerEmail: string;

  @Column()
  customerFirstName: string;

  @Column()
  customerLastName: string;

  @Column({ nullable: true })
  customerPhone: string;

  // Shipping address (stored as JSON string for SQLite compatibility)
  @Column({ type: 'text' })
  shippingAddress: string;

  // Billing address (optional, defaults to shipping)
  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  trackingNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  // @OneToMany(() => require('../../payments/entities/payment.entity').Payment, (payment) => payment.order)
  // payments: any[];

  // Computed properties
  get customerFullName(): string {
    return `${this.customerFirstName} ${this.customerLastName}`;
  }

  get itemCount(): number {
    return this.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }
}