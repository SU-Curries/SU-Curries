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
import { Category } from './category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column()
  sku: string;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  weight: number;

  @Column({ default: 'kg' })
  weightUnit: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  featuredImage: string;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: ProductStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;

  // Multi-language support (stored as JSON strings)
  @Column({ type: 'text', nullable: true })
  nameTranslations: string;

  @Column({ type: 'text', nullable: true })
  descriptionTranslations: string;

  // SEO fields
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  slug: string;

  // Nutritional information (stored as JSON string)
  @Column({ type: 'text', nullable: true })
  nutritionalInfo: string;

  // Dietary information
  @Column('simple-array', { nullable: true })
  dietaryTags: string[]; // vegan, gluten-free, etc.

  @Column({ type: 'int', nullable: true })
  spiceLevel: number; // 1-3 scale

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  // Computed properties
  get isInStock(): boolean {
    return this.stockQuantity > 0 && this.status === ProductStatus.ACTIVE;
  }

  get isLowStock(): boolean {
    return this.stockQuantity <= this.lowStockThreshold;
  }

  get discountPercentage(): number {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
      return 0;
    }
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
}