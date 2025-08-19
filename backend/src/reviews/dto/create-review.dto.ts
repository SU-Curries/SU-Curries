import { IsEnum, IsUUID, IsInt, Min, Max, IsOptional, IsString, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewType } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty({ enum: ReviewType, example: ReviewType.PRODUCT })
  @IsEnum(ReviewType)
  type: ReviewType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  targetId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great product! Highly recommend it.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @ApiPropertyOptional({ 
    type: [String], 
    example: ['https://example.com/review-image1.jpg', 'https://example.com/review-image2.jpg'] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}