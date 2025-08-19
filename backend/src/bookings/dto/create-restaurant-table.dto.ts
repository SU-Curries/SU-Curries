import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantTableDto {
  @ApiProperty({ description: 'Table number (unique identifier)' })
  @IsString()
  @IsNotEmpty()
  tableNumber: string;

  @ApiProperty({ description: 'Maximum seating capacity' })
  @IsNumber()
  @Min(1)
  @Max(20)
  capacity: number;

  @ApiProperty({ description: 'Table location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Table status', required: false, default: 'available' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Additional notes about the table', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Whether the table is active', required: false, default: true })
  @IsOptional()
  isActive?: boolean;
}