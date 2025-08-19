import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewType, ReviewStatus } from '../entities/review.entity';

export class ReviewQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: ReviewType })
  @IsOptional()
  @IsEnum(ReviewType)
  type?: ReviewType;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'rating', 'helpfulCount'])
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortOrder?: string;
}

export class ReviewHelpfulnessDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  isHelpful?: boolean;
}