import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    try {
      // Get user
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create order
      const order = this.orderRepository.create({
        ...createOrderDto,
        user,
        orderNumber: this.generateOrderNumber(),
        status: OrderStatus.PENDING,
      });

      const savedOrder = await this.orderRepository.save(order);

      // Create order items
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        const orderItems = createOrderDto.items.map(item => 
          this.orderItemRepository.create({
            ...item,
            order: savedOrder,
          })
        );
        await this.orderItemRepository.save(orderItems);
      }

      return this.findOne(savedOrder.id, userId);
    } catch (error) {
      throw new BadRequestException('Failed to create order: ' + error.message);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['user', 'items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { orders, total };
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 10): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { orders, total };
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const whereCondition: any = { id };
    if (userId) {
      whereCondition.user = { id: userId };
    }

    const order = await this.orderRepository.findOne({
      where: whereCondition,
      relations: ['user', 'items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async cancel(id: string, userId: string): Promise<Order> {
    const order = await this.findOne(id, userId);
    
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel order in current status');
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
    
    return order;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}