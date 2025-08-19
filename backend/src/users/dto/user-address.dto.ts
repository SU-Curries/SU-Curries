import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  label: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Berlin' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Berlin' })
  @IsString()
  state: string;

  @ApiProperty({ example: '10115' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'Germany' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateUserAddressDto {
  @ApiPropertyOptional({ example: 'Home' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'Berlin' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Berlin' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '10115' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Germany' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}