import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'customer', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty({ message: 'Data processing consent is required' })
  dataProcessingConsent: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}