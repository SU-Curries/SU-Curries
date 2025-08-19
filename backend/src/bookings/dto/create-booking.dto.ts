import { IsUUID, IsEmail, IsString, IsInt, Min, Max, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ example: '2025-07-26' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: '19:00' })
  @IsString()
  bookingTime: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(20)
  guestCount: number;

  @ApiPropertyOptional({ example: 'table-1' })
  @IsOptional()
  @IsString()
  restaurantTableId?: string;

  @ApiPropertyOptional({ example: 'Window seat preferred' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ example: 'Birthday celebration' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isVip?: boolean;
}