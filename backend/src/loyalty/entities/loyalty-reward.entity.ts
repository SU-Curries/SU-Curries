import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RewardType {
  DISCOUNT_PERCENTAGE = 'discount_percentage',
  DISCOUNT_FIXED = 'discount_fixed',
  FREE_SHIPPING = 'free_shipping',
  FREE_PRODUCT = 'free_product',
  CLASS_DISCOUNT = 'class_discount',
}

@Entity('loyalty_rewards')
export class LoyaltyReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
  })
  type: RewardType;

  @Column({ type: 'int' })
  pointsCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value?: number; // Discount amount or percentage

  @Column('uuid', { nullable: true })
  productId?: string; // For free product rewards

  @Column({ type: 'int', nullable: true })
  maxRedemptions?: number; // Null = unlimited

  @Column({ type: 'int', default: 0 })
  currentRedemptions: number;

  @Column({ type: 'date', nullable: true })
  validFrom?: Date;

  @Column({ type: 'date', nullable: true })
  validUntil?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  conditions?: {
    minOrderAmount?: number;
    applicableCategories?: string[];
    tierRestriction?: string[];
  };

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get isAvailable(): boolean {
    const now = new Date();
    const isWithinDateRange = (!this.validFrom || now >= this.validFrom) && 
                             (!this.validUntil || now <= this.validUntil);
    const hasRedemptionsLeft = !this.maxRedemptions || this.currentRedemptions < this.maxRedemptions;
    
    return this.isActive && isWithinDateRange && hasRedemptionsLeft;
  }

  get redemptionsLeft(): number | null {
    return this.maxRedemptions ? this.maxRedemptions - this.currentRedemptions : null;
  }
}