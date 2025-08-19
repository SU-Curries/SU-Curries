import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findAll(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ordersService.findAllByUser(req.user.userId, page, limit);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'All orders retrieved successfully' })
  findAllAdmin(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ordersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order (admin only)' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete order (admin only)' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancel(id, req.user.userId);
  }
}