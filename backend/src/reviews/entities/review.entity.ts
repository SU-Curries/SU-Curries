import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum ReviewType {
  PRODUCT = 'product',
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reviews')
@Index(['type', 'targetId'])
@Index(['userId', 'type', 'targetId'], { unique: true }) // One review per user per item
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  type: ReviewType;

  @Column('uuid')
  targetId: string; // Product ID

  @Column('uuid')
  userId: string;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: ReviewStatus;

  @Column({ nullable: true })
  moderatorNotes?: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedPurchase: boolean;

  @Column({ type: 'json', nullable: true })
  images?: string[]; // Array of image URLs

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ type: 'int', default: 0 })
  notHelpfulCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'targetId' })
  product?: Product;

  // Computed properties
  get customerName(): string {
    return `${this.user.firstName} ${this.user.lastName.charAt(0)}.`;
  }

  get helpfulnessRatio(): number {
    const total = this.helpfulCount + this.notHelpfulCount;
    return total > 0 ? this.helpfulCount / total : 0;
  }
}