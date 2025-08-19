import { IsInt, Min, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoyaltyEarnReason, LoyaltyRedeemReason } from '../entities/loyalty-transaction.entity';

export class AwardPointsDto {
  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  points: number;

  @ApiProperty({ enum: LoyaltyEarnReason })
  @IsEnum(LoyaltyEarnReason)
  reason: LoyaltyEarnReason;

  @ApiPropertyOptional({ example: 'Bonus points for special promotion' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;
}

export class RedeemPointsDto {
  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  points: number;

  @ApiProperty({ enum: LoyaltyRedeemReason })
  @IsEnum(LoyaltyRedeemReason)
  reason: LoyaltyRedeemReason;

  @ApiPropertyOptional({ example: 'Redeemed for 10% discount' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;
}

export class TransactionQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}