import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { AwardPointsDto, RedeemPointsDto, TransactionQueryDto } from './dto/loyalty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Loyalty Program')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user loyalty account' })
  @ApiResponse({ status: 200, description: 'Returns user loyalty account' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccount(@GetUser() user: User) {
    return this.loyaltyService.getOrCreateAccount(user.id);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user loyalty transactions' })
  @ApiResponse({ status: 200, description: 'Returns paginated loyalty transactions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTransactions(@GetUser() user: User, @Query() query: TransactionQueryDto) {
    const account = await this.loyaltyService.getOrCreateAccount(user.id);
    return this.loyaltyService.getAccountTransactions(account.id, query.page, query.limit);
  }

  @Get('rewards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available rewards for user tier' })
  @ApiResponse({ status: 200, description: 'Returns available rewards' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAvailableRewards(@GetUser() user: User) {
    const account = await this.loyaltyService.getOrCreateAccount(user.id);
    return this.loyaltyService.getAvailableRewards(account.tier);
  }

  @Post('redeem/:rewardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem a loyalty reward' })
  @ApiResponse({ status: 200, description: 'Reward redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points or reward not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async redeemReward(@GetUser() user: User, @Param('rewardId') rewardId: string) {
    const account = await this.loyaltyService.getOrCreateAccount(user.id);
    return this.loyaltyService.redeemReward(account.id, rewardId);
  }

  // Admin endpoints
  @Post('admin/award/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Award points to user (admin only)' })
  @ApiResponse({ status: 200, description: 'Points awarded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async awardPoints(@Param('userId') userId: string, @Body() awardPointsDto: AwardPointsDto) {
    const account = await this.loyaltyService.getOrCreateAccount(userId);
    return this.loyaltyService.awardPoints(
      account.id,
      awardPointsDto.points,
      awardPointsDto.reason,
      awardPointsDto.description,
      awardPointsDto.referenceId
    );
  }

  @Post('admin/redeem/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem points from user (admin only)' })
  @ApiResponse({ status: 200, description: 'Points redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async redeemPoints(@Param('userId') userId: string, @Body() redeemPointsDto: RedeemPointsDto) {
    const account = await this.loyaltyService.getOrCreateAccount(userId);
    return this.loyaltyService.redeemPoints(
      account.id,
      redeemPointsDto.points,
      redeemPointsDto.reason,
      redeemPointsDto.description,
      redeemPointsDto.referenceId
    );
  }

  @Get('admin/accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all loyalty accounts (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all loyalty accounts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAllAccounts() {
    // This would need to be implemented in the service
    return { message: 'Admin loyalty accounts endpoint' };
  }
}