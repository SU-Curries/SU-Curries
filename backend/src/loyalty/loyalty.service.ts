import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { LoyaltyAccount, LoyaltyTier } from './entities/loyalty-account.entity';
import { LoyaltyTransaction, LoyaltyTransactionType, LoyaltyEarnReason, LoyaltyRedeemReason } from './entities/loyalty-transaction.entity';
import { LoyaltyReward, RewardType } from './entities/loyalty-reward.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class LoyaltyService {
  private readonly TIER_THRESHOLDS = {
    [LoyaltyTier.BRONZE]: 0,
    [LoyaltyTier.SILVER]: 500,
    [LoyaltyTier.GOLD]: 1500,
    [LoyaltyTier.PLATINUM]: 3000,
  };

  private readonly TIER_MULTIPLIERS = {
    [LoyaltyTier.BRONZE]: 1.0,
    [LoyaltyTier.SILVER]: 1.25,
    [LoyaltyTier.GOLD]: 1.5,
    [LoyaltyTier.PLATINUM]: 2.0,
  };

  private readonly POINTS_PER_EURO = 10; // 10 points per €1 spent
  private readonly POINTS_EXPIRY_MONTHS = 12; // Points expire after 12 months

  constructor(
    @InjectRepository(LoyaltyAccount)
    private loyaltyAccountRepository: Repository<LoyaltyAccount>,
    @InjectRepository(LoyaltyTransaction)
    private loyaltyTransactionRepository: Repository<LoyaltyTransaction>,
    @InjectRepository(LoyaltyReward)
    private loyaltyRewardRepository: Repository<LoyaltyReward>,
  ) {}

  async getOrCreateAccount(userId: string): Promise<LoyaltyAccount> {
    let account = await this.loyaltyAccountRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!account) {
      account = await this.createAccount(userId);
    }

    return account;
  }

  async createAccount(userId: string): Promise<LoyaltyAccount> {
    const account = this.loyaltyAccountRepository.create({
      userId,
      currentPoints: 0,
      lifetimePoints: 0,
      tier: LoyaltyTier.BRONZE,
      pointsMultiplier: this.TIER_MULTIPLIERS[LoyaltyTier.BRONZE],
      nextTierThreshold: this.TIER_THRESHOLDS[LoyaltyTier.SILVER],
      isActive: true,
    });

    const savedAccount = await this.loyaltyAccountRepository.save(account);

    // Award signup bonus
    await this.awardPoints(
      savedAccount.id,
      100,
      LoyaltyEarnReason.SIGNUP_BONUS,
      'Welcome bonus for joining SU Curries loyalty program'
    );

    return this.loyaltyAccountRepository.findOne({
      where: { id: savedAccount.id },
      relations: ['user'],
    });
  }

  async awardPoints(
    accountId: string,
    basePoints: number,
    reason: LoyaltyEarnReason,
    description?: string,
    referenceId?: string
  ): Promise<LoyaltyTransaction> {
    const account = await this.loyaltyAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    // Apply tier multiplier
    const points = Math.floor(basePoints * account.pointsMultiplier);

    // Set expiry date
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + this.POINTS_EXPIRY_MONTHS);

    // Create transaction
    const transaction = this.loyaltyTransactionRepository.create({
      loyaltyAccountId: accountId,
      type: LoyaltyTransactionType.EARNED,
      points,
      earnReason: reason,
      description,
      referenceId,
      expiresAt,
    });

    const savedTransaction = await this.loyaltyTransactionRepository.save(transaction);

    // Update account
    account.currentPoints += points;
    account.lifetimePoints += points;
    account.lastActivityDate = new Date();

    // Check for tier upgrade
    await this.updateTier(account);

    await this.loyaltyAccountRepository.save(account);

    return savedTransaction;
  }

  async redeemPoints(
    accountId: string,
    points: number,
    reason: LoyaltyRedeemReason,
    description?: string,
    referenceId?: string
  ): Promise<LoyaltyTransaction> {
    const account = await this.loyaltyAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    if (account.currentPoints < points) {
      throw new BadRequestException('Insufficient points');
    }

    // Create transaction
    const transaction = this.loyaltyTransactionRepository.create({
      loyaltyAccountId: accountId,
      type: LoyaltyTransactionType.REDEEMED,
      points: -points, // Negative for redemption
      redeemReason: reason,
      description,
      referenceId,
    });

    const savedTransaction = await this.loyaltyTransactionRepository.save(transaction);

    // Update account
    account.currentPoints -= points;
    account.lastActivityDate = new Date();

    await this.loyaltyAccountRepository.save(account);

    return savedTransaction;
  }

  async awardPointsForOrder(order: Order): Promise<void> {
    if (!order.userId) return; // Guest orders don't earn points

    const account = await this.getOrCreateAccount(order.userId);
    const basePoints = Math.floor(Number(order.totalAmount) * this.POINTS_PER_EURO);

    await this.awardPoints(
      account.id,
      basePoints,
      LoyaltyEarnReason.PURCHASE,
      `Points earned from order ${order.orderNumber}`,
      order.id
    );
  }

  async awardPointsForBooking(booking: Booking): Promise<void> {
    if (!booking.userId) return; // Guest bookings don't earn points

    const account = await this.getOrCreateAccount(booking.userId);
    const basePoints = Math.floor(Number(booking.totalAmount || 0) * this.POINTS_PER_EURO);

    await this.awardPoints(
      account.id,
      basePoints,
      LoyaltyEarnReason.BOOKING,
      `Points earned from cooking class booking`,
      booking.id
    );
  }

  async awardPointsForReview(): Promise<void> {
    // Award points for writing reviews
    // This would be called from the reviews service
  }

  async getAccountTransactions(accountId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.loyaltyTransactionRepository.findAndCount({
      where: { loyaltyAccountId: accountId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAvailableRewards(tier?: LoyaltyTier): Promise<LoyaltyReward[]> {
    const queryBuilder = this.loyaltyRewardRepository.createQueryBuilder('reward')
      .where('reward.isActive = :isActive', { isActive: true })
      .andWhere('(reward.validFrom IS NULL OR reward.validFrom <= :now)', { now: new Date() })
      .andWhere('(reward.validUntil IS NULL OR reward.validUntil >= :now)', { now: new Date() })
      .andWhere('(reward.maxRedemptions IS NULL OR reward.currentRedemptions < reward.maxRedemptions)');

    if (tier) {
      queryBuilder.andWhere(
        '(reward.conditions IS NULL OR reward.conditions->>\'tierRestriction\' IS NULL OR :tier = ANY(string_to_array(reward.conditions->>\'tierRestriction\', \',\')))',
        { tier }
      );
    }

    return queryBuilder.orderBy('reward.pointsCost', 'ASC').getMany();
  }

  async redeemReward(accountId: string, rewardId: string): Promise<{ transaction: LoyaltyTransaction; reward: LoyaltyReward }> {
    const account = await this.loyaltyAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (!reward.isAvailable) {
      throw new BadRequestException('Reward is not available');
    }

    if (account.currentPoints < reward.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    // Check tier restrictions
    if (reward.conditions?.tierRestriction && 
        !reward.conditions.tierRestriction.includes(account.tier)) {
      throw new BadRequestException('Reward not available for your tier');
    }

    // Redeem points
    const transaction = await this.redeemPoints(
      accountId,
      reward.pointsCost,
      this.getRedeemReasonFromRewardType(reward.type),
      `Redeemed: ${reward.name}`,
      rewardId
    );

    // Update reward redemption count
    reward.currentRedemptions++;
    await this.loyaltyRewardRepository.save(reward);

    return { transaction, reward };
  }

  async expirePoints(): Promise<void> {
    const expiredTransactions = await this.loyaltyTransactionRepository.find({
      where: {
        type: LoyaltyTransactionType.EARNED,
        expiresAt: MoreThan(new Date()),
        isExpired: false,
      },
      relations: ['loyaltyAccount'],
    });

    for (const transaction of expiredTransactions) {
      // Create expiry transaction
      await this.loyaltyTransactionRepository.save({
        loyaltyAccountId: transaction.loyaltyAccountId,
        type: LoyaltyTransactionType.EXPIRED,
        points: -transaction.points,
        description: `Points expired from transaction ${transaction.id}`,
      });

      // Update account points
      const account = transaction.loyaltyAccount;
      account.currentPoints = Math.max(0, account.currentPoints - transaction.points);
      await this.loyaltyAccountRepository.save(account);

      // Mark transaction as expired
      transaction.isExpired = true;
      await this.loyaltyTransactionRepository.save(transaction);
    }
  }

  private async updateTier(account: LoyaltyAccount): Promise<void> {
    let newTier = account.tier;
    let nextThreshold = account.nextTierThreshold;

    // Check for tier upgrades
    if (account.lifetimePoints >= this.TIER_THRESHOLDS[LoyaltyTier.PLATINUM]) {
      newTier = LoyaltyTier.PLATINUM;
      nextThreshold = null;
    } else if (account.lifetimePoints >= this.TIER_THRESHOLDS[LoyaltyTier.GOLD]) {
      newTier = LoyaltyTier.GOLD;
      nextThreshold = this.TIER_THRESHOLDS[LoyaltyTier.PLATINUM];
    } else if (account.lifetimePoints >= this.TIER_THRESHOLDS[LoyaltyTier.SILVER]) {
      newTier = LoyaltyTier.SILVER;
      nextThreshold = this.TIER_THRESHOLDS[LoyaltyTier.GOLD];
    }

    if (newTier !== account.tier) {
      account.tier = newTier;
      account.pointsMultiplier = this.TIER_MULTIPLIERS[newTier];
      account.nextTierThreshold = nextThreshold;

      // Award tier upgrade bonus
      const bonusPoints = this.getTierUpgradeBonus(newTier);
      if (bonusPoints > 0) {
        await this.awardPoints(
          account.id,
          bonusPoints,
          LoyaltyEarnReason.ADMIN_ADJUSTMENT,
          `Tier upgrade bonus for reaching ${newTier} tier`
        );
      }
    }
  }

  private getTierUpgradeBonus(tier: LoyaltyTier): number {
    switch (tier) {
      case LoyaltyTier.SILVER: return 100;
      case LoyaltyTier.GOLD: return 250;
      case LoyaltyTier.PLATINUM: return 500;
      default: return 0;
    }
  }

  private getRedeemReasonFromRewardType(type: RewardType): LoyaltyRedeemReason {
    switch (type) {
      case RewardType.DISCOUNT_PERCENTAGE:
      case RewardType.DISCOUNT_FIXED:
        return LoyaltyRedeemReason.DISCOUNT;
      case RewardType.FREE_SHIPPING:
        return LoyaltyRedeemReason.FREE_SHIPPING;
      case RewardType.FREE_PRODUCT:
        return LoyaltyRedeemReason.FREE_PRODUCT;
      case RewardType.CLASS_DISCOUNT:
        return LoyaltyRedeemReason.CLASS_DISCOUNT;
      default:
        return LoyaltyRedeemReason.ADMIN_ADJUSTMENT;
    }
  }
}