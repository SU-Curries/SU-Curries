import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Total price for this item' })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order items', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ description: 'Subtotal amount' })
  @IsNotEmpty()
  @IsNumber()
  subtotal: number;

  @ApiProperty({ description: 'Tax amount' })
  @IsNotEmpty()
  @IsNumber()
  taxAmount: number;

  @ApiProperty({ description: 'Shipping amount' })
  @IsNotEmpty()
  @IsNumber()
  shippingAmount: number;

  @ApiProperty({ description: 'Discount amount', required: false })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiProperty({ description: 'Total amount' })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: 'Currency code', default: 'EUR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Payment method' })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: 'Order notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}