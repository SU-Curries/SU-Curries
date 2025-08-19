import { IsInt, Min, Max, IsOptional, IsString, IsArray, MaxLength, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewStatus } from '../entities/review.entity';

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 'Updated review comment.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @ApiPropertyOptional({ 
    type: [String], 
    example: ['https://example.com/review-image1.jpg'] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class ModerateReviewDto {
  @ApiPropertyOptional({ enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({ example: 'Review approved after moderation.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  moderatorNotes?: string;
}