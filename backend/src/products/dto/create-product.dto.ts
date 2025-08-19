import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Compare at price', required: false })
  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty({ description: 'Product SKU' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ description: 'Stock quantity' })
  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty({ description: 'Product images', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ description: 'Main product image', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Featured image', required: false })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ description: 'Product status', enum: ProductStatus })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({ description: 'Is featured product' })
  @IsBoolean()
  isFeatured: boolean;

  @ApiProperty({ description: 'Product slug' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Spice level (1-5)', required: false })
  @IsOptional()
  @IsNumber()
  spiceLevel?: number;

  @ApiProperty({ description: 'Dietary tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryTags?: string[];

  @ApiProperty({ description: 'Ingredients', required: false })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiProperty({ description: 'Nutritional information', required: false })
  @IsOptional()
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };

  @ApiProperty({ description: 'Cooking instructions', required: false })
  @IsOptional()
  @IsString()
  cookingInstructions?: string;
}