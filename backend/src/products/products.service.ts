import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatus } from './entities/product.entity';

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productData = {
      ...createProductDto,
      status: createProductDto.status || ProductStatus.ACTIVE,
      nutritionalInfo: typeof createProductDto.nutritionalInfo === 'object' 
        ? JSON.stringify(createProductDto.nutritionalInfo) 
        : createProductDto.nutritionalInfo,
    };
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async findAll(options: FindAllOptions = {}): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 10, search, categoryId } = options;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC');

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  }

  async findFeatured(limit: number = 4): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isFeatured: true, status: ProductStatus.ACTIVE },
      relations: ['category'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}