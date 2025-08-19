import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ModerateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto, ReviewHelpfulnessDto } from './dto/review-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ReviewType } from './entities/review.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filtering' })
  @ApiResponse({ status: 200, description: 'Returns paginated reviews' })
  findAll(@Query() query: ReviewQueryDto, @GetUser() user?: User) {
    return this.reviewsService.findAll(query, user);
  }

  @Get('stats/:type/:targetId')
  @ApiOperation({ summary: 'Get review statistics for a product or class' })
  @ApiResponse({ status: 200, description: 'Returns review statistics' })
  getReviewStats(
    @Param('type') type: ReviewType,
    @Param('targetId') targetId: string,
  ) {
    return this.reviewsService.getReviewStats(type, targetId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Returns the review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string, @GetUser() user?: User) {
    return this.reviewsService.findOne(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or not eligible to review' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Already reviewed this item' })
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update your own review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or cannot update approved review' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only update your own reviews' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @GetUser() user: User) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Moderate review (admin only)' })
  @ApiResponse({ status: 200, description: 'Review moderated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  moderate(@Param('id') id: string, @Body() moderateReviewDto: ModerateReviewDto) {
    return this.reviewsService.moderate(id, moderateReviewDto);
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark review as helpful or not helpful' })
  @ApiResponse({ status: 200, description: 'Vote recorded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  markHelpful(
    @Param('id') id: string,
    @Body() helpfulnessDto: ReviewHelpfulnessDto,
    @GetUser() user: User,
  ) {
    return this.reviewsService.markHelpful(id, helpfulnessDto.isHelpful || true, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only delete your own reviews or admin' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.reviewsService.remove(id, user);
  }
}