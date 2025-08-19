import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LoyaltyAccount } from './loyalty-account.entity';

export enum LoyaltyTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  ADJUSTED = 'adjusted',
}

export enum LoyaltyEarnReason {
  PURCHASE = 'purchase',
  BOOKING = 'booking',
  REVIEW = 'review',
  REFERRAL = 'referral',
  BIRTHDAY = 'birthday',
  SIGNUP_BONUS = 'signup_bonus',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

export enum LoyaltyRedeemReason {
  DISCOUNT = 'discount',
  FREE_SHIPPING = 'free_shipping',
  FREE_PRODUCT = 'free_product',
  CLASS_DISCOUNT = 'class_discount',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  loyaltyAccountId: string;

  @Column({
    type: 'varchar',
  })
  type: LoyaltyTransactionType;

  @Column({ type: 'int' })
  points: number; // Positive for earned, negative for redeemed

  @Column({ nullable: true })
  earnReason?: LoyaltyEarnReason;

  @Column({ nullable: true })
  redeemReason?: LoyaltyRedeemReason;

  @Column({ nullable: true })
  description?: string;

  @Column('uuid', { nullable: true })
  referenceId?: string; // Order ID, Booking ID, etc.

  @Column({ type: 'date', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'boolean', default: false })
  isExpired: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => LoyaltyAccount, account => account.transactions)
  @JoinColumn({ name: 'loyaltyAccountId' })
  loyaltyAccount: LoyaltyAccount;
}