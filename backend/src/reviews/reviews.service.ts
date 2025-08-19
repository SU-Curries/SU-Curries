import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Review, ReviewType, ReviewStatus } from './entities/review.entity';
import { ReviewHelpfulness } from './entities/review-helpfulness.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ModerateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { User } from '../users/entities/user.entity';
import { OrdersService } from '../orders/orders.service';
import { BookingsService } from '../bookings/bookings.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewHelpfulness)
    private reviewHelpfulnessRepository: Repository<ReviewHelpfulness>,
    private ordersService: OrdersService,
    private bookingsService: BookingsService,
    private productsService: ProductsService,
  ) {}

  async findAll(query: ReviewQueryDto, user?: User) {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      targetId, 
      rating, 
      status = ReviewStatus.APPROVED, // Default to approved reviews for public
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = query;
    
    const skip = (page - 1) * limit;
    
    // Build where conditions
    const where: FindOptionsWhere<Review> = {};
    
    if (type) {
      where.type = type;
    }
    
    if (targetId) {
      where.targetId = targetId;
    }
    
    if (rating) {
      where.rating = rating;
    }
    
    // Only admins can see non-approved reviews
    if (user?.role === 'admin') {
      if (status) {
        where.status = status;
      }
    } else {
      where.status = ReviewStatus.APPROVED;
    }
    
    // Build order conditions
    const order: any = {};
    order[sortBy] = sortOrder.toUpperCase();
    
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where,
      order,
      skip,
      take: limit,
      relations: ['user'],
    });
    
    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: User) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    // Only show approved reviews to non-admins, unless it's the user's own review
    if (user?.role !== 'admin' && review.status !== ReviewStatus.APPROVED && review.userId !== user?.id) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    return review;
  }

  async create(createReviewDto: CreateReviewDto, user: User) {
    const { type, targetId, rating, comment, images } = createReviewDto;
    
    // Check if user already reviewed this item
    const existingReview = await this.reviewRepository.findOne({
      where: { userId: user.id, type, targetId },
    });
    
    if (existingReview) {
      throw new ConflictException('You have already reviewed this item');
    }
    
    // Verify user has purchased/booked the item
    let isVerifiedPurchase = false;
    
    if (type === ReviewType.PRODUCT) {
      isVerifiedPurchase = await this.verifyProductPurchase(user.id, targetId);
    }
    
    if (!isVerifiedPurchase) {
      throw new BadRequestException('You can only review items you have purchased or classes you have attended');
    }
    
    // Create review
    const review = this.reviewRepository.create({
      type,
      targetId,
      userId: user.id,
      rating,
      comment,
      images,
      isVerifiedPurchase,
      status: ReviewStatus.PENDING, // Reviews need moderation
    });
    
    const savedReview = await this.reviewRepository.save(review);
    
    // Update product/class average rating
    await this.updateAverageRating(type, targetId);
    
    return this.findOne(savedReview.id, user);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User) {
    const review = await this.findOne(id, user);
    
    // Only the review author can update their review
    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only update your own reviews');
    }
    
    // Can't update approved reviews (would need re-moderation)
    if (review.status === ReviewStatus.APPROVED) {
      throw new BadRequestException('Cannot update approved reviews');
    }
    
    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);
    
    return updatedReview;
  }

  async moderate(id: string, moderateReviewDto: ModerateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    const oldStatus = review.status;
    Object.assign(review, moderateReviewDto);
    
    const updatedReview = await this.reviewRepository.save(review);
    
    // Update average rating if status changed to/from approved
    if (oldStatus !== updatedReview.status && 
        (oldStatus === ReviewStatus.APPROVED || updatedReview.status === ReviewStatus.APPROVED)) {
      await this.updateAverageRating(review.type, review.targetId);
    }
    
    return updatedReview;
  }

  async remove(id: string, user: User) {
    const review = await this.findOne(id, user);
    
    // Only the review author or admin can delete
    if (review.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    
    await this.reviewRepository.remove(review);
    
    // Update average rating
    await this.updateAverageRating(review.type, review.targetId);
    
    return { message: 'Review deleted successfully' };
  }

  async markHelpful(reviewId: string, isHelpful: boolean, user: User) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
    
    // Check if user already voted
    const existingVote = await this.reviewHelpfulnessRepository.findOne({
      where: { userId: user.id, reviewId },
    });
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.isHelpful !== isHelpful) {
        existingVote.isHelpful = isHelpful;
        await this.reviewHelpfulnessRepository.save(existingVote);
        
        // Update counts
        if (isHelpful) {
          review.helpfulCount++;
          review.notHelpfulCount--;
        } else {
          review.helpfulCount--;
          review.notHelpfulCount++;
        }
      }
    } else {
      // Create new vote
      const vote = this.reviewHelpfulnessRepository.create({
        userId: user.id,
        reviewId,
        isHelpful,
      });
      
      await this.reviewHelpfulnessRepository.save(vote);
      
      // Update counts
      if (isHelpful) {
        review.helpfulCount++;
      } else {
        review.notHelpfulCount++;
      }
    }
    
    await this.reviewRepository.save(review);
    
    return { message: 'Vote recorded successfully' };
  }

  async getReviewStats(type: ReviewType, targetId: string) {
    const reviews = await this.reviewRepository.find({
      where: { type, targetId, status: ReviewStatus.APPROVED },
    });
    
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });
    
    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      ratingDistribution,
    };
  }

  private async verifyProductPurchase(userId: string, productId: string): Promise<boolean> {
    try {
      // Check if user has ordered this product
      const orders = await this.ordersService.findAllByUser(userId, 1, 1000);
      
      for (const order of orders.orders) {
        if (order.status === 'delivered') {
          const hasProduct = order.items.some(item => item.productId === productId);
          if (hasProduct) return true;
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }



  private async updateAverageRating(type: ReviewType, targetId: string) {
    const stats = await this.getReviewStats(type, targetId);
    
    try {
      if (type === ReviewType.PRODUCT) {
        // Update product average rating
        const product = await this.productsService.findOne(targetId);
        // Note: You'd need to add averageRating field to Product entity
        // await this.productsService.updateAverageRating(targetId, stats.averageRating);
      }
    } catch (error) {
      // Log error but don't fail the review operation
      console.error('Failed to update average rating:', error);
    }
  }
}