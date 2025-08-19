import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category image', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Category slug' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Is category active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}