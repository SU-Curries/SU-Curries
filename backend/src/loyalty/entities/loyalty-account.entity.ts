import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LoyaltyTransaction } from './loyalty-transaction.entity';

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

@Entity('loyalty_accounts')
export class LoyaltyAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  userId: string;

  @Column({ type: 'int', default: 0 })
  currentPoints: number;

  @Column({ type: 'int', default: 0 })
  lifetimePoints: number;

  @Column({
    type: 'varchar',
    default: 'bronze',
  })
  tier: LoyaltyTier;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  pointsMultiplier: number; // Tier-based multiplier

  @Column({ nullable: true })
  nextTierThreshold?: number;

  @Column({ type: 'date', nullable: true })
  lastActivityDate?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => LoyaltyTransaction, transaction => transaction.loyaltyAccount)
  transactions: LoyaltyTransaction[];

  // Computed properties
  get pointsToNextTier(): number {
    return this.nextTierThreshold ? Math.max(0, this.nextTierThreshold - this.lifetimePoints) : 0;
  }

  get tierBenefits(): string[] {
    switch (this.tier) {
      case LoyaltyTier.BRONZE:
        return ['1x points on purchases', 'Birthday discount'];
      case LoyaltyTier.SILVER:
        return ['1.25x points on purchases', 'Birthday discount', 'Free shipping on orders over €30'];
      case LoyaltyTier.GOLD:
        return ['1.5x points on purchases', 'Birthday discount', 'Free shipping on all orders', 'Early access to new products'];
      case LoyaltyTier.PLATINUM:
        return ['2x points on purchases', 'Birthday discount', 'Free shipping on all orders', 'Early access to new products', 'Exclusive cooking classes', 'Personal chef consultation'];
      default:
        return [];
    }
  }
}