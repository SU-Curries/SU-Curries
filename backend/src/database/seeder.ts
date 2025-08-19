import { DataSource } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { RestaurantTable } from '../bookings/entities/restaurant-table.entity';
import * as bcrypt from 'bcryptjs';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    try {
      // Seed Categories
      await this.seedCategories();
      
      // Seed Products
      await this.seedProducts();
      
      // Seed Users
      await this.seedUsers();
      
      // Seed Restaurant Tables
      await this.seedRestaurantTables();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async seedCategories() {
    const categoryRepository = this.dataSource.getRepository(Category);
    
    const categories = [
      {
        id: 'cat-1',
        name: 'Curry Bases',
        description: 'Rich and aromatic curry bases',
        slug: 'curry-bases',
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'cat-2',
        name: 'Gravies',
        description: 'Versatile gravies for various dishes',
        slug: 'gravies',
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'cat-3',
        name: 'Spice Mixes',
        description: 'Authentic spice blends',
        slug: 'spice-mixes',
        isActive: true,
        sortOrder: 3
      },
      {
        id: 'cat-4',
        name: 'Special Combos',
        description: 'Complete meal solutions',
        slug: 'special-combos',
        isActive: true,
        sortOrder: 4
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await categoryRepository.findOne({ where: { id: categoryData.id } });
      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`✅ Created category: ${categoryData.name}`);
      }
    }
  }

  private async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    
    const products = [
      {
        id: 'prod-1',
        name: 'Spicy Curry Base',
        description: 'A rich and aromatic base for your favorite curry dishes. Made with traditional spices and herbs.',
        price: 5.99,
        sku: 'SCB-001',
        stockQuantity: 50,
        image: '/images/products/curry-base-spicy.jpg',
        featuredImage: '/images/products/curry-base-spicy.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: 'cat-1'
      },
      {
        id: 'prod-2',
        name: 'Mild Curry Base',
        description: 'Perfect for those who prefer milder flavors. Creamy and smooth texture.',
        price: 5.99,
        sku: 'MCB-001',
        stockQuantity: 45,
        image: '/images/products/curry-base-mild.jpg',
        featuredImage: '/images/products/curry-base-mild.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: 'cat-1'
      },
      {
        id: 'prod-3',
        name: 'Korma Curry Base',
        description: 'Luxurious and creamy korma base with cashews and aromatic spices.',
        price: 6.99,
        sku: 'KCB-001',
        stockQuantity: 30,
        image: '/images/products/curry-base-korma.jpg',
        featuredImage: '/images/products/curry-base-korma.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: 'cat-1'
      },
      {
        id: 'prod-4',
        name: 'Tomato Gravy',
        description: 'Rich tomato-based gravy perfect for various Indian dishes.',
        price: 4.99,
        sku: 'TG-001',
        stockQuantity: 40,
        image: '/images/products/tomato-gravy.jpg',
        featuredImage: '/images/products/tomato-gravy.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        categoryId: 'cat-2'
      },
      {
        id: 'prod-5',
        name: 'Onion Gravy',
        description: 'Caramelized onion gravy base for authentic Indian flavors.',
        price: 4.99,
        sku: 'OG-001',
        stockQuantity: 35,
        image: '/images/products/onion-gravy.jpg',
        featuredImage: '/images/products/onion-gravy.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        categoryId: 'cat-2'
      },
      {
        id: 'prod-6',
        name: 'Biryani Spice Mix',
        description: 'Authentic spice blend for perfect biryani every time.',
        price: 3.99,
        sku: 'BSM-001',
        stockQuantity: 60,
        image: '/images/products/biryani-spice-mix.jpg',
        featuredImage: '/images/products/biryani-spice-mix.jpg',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: 'cat-3'
      }
    ];

    for (const productData of products) {
      const existingProduct = await productRepository.findOne({ where: { id: productData.id } });
      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`✅ Created product: ${productData.name}`);
      }
    }
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    
    const users = [
      {
        id: 'admin-1',
        email: 'admin@sucurries.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true
      },
      {
        id: 'user-1',
        email: 'user@sucurries.com',
        password: await bcrypt.hash('user123', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true
      }
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`✅ Created user: ${userData.email}`);
      }
    }
  }

  private async seedRestaurantTables() {
    const tableRepository = this.dataSource.getRepository(RestaurantTable);
    
    const tables = [
      {
        id: 'table-1',
        tableNumber: '1',
        capacity: 2,
        location: 'window',
        status: 'available',
        isActive: true,
        notes: 'Cozy window table for two'
      },
      {
        id: 'table-2',
        tableNumber: '2',
        capacity: 4,
        location: 'main dining',
        status: 'available',
        isActive: true,
        notes: 'Family table in main dining area'
      },
      {
        id: 'table-3',
        tableNumber: '3',
        capacity: 6,
        location: 'main dining',
        status: 'available',
        isActive: true,
        notes: 'Large table for groups'
      },
      {
        id: 'table-4',
        tableNumber: '4',
        capacity: 2,
        location: 'patio',
        status: 'available',
        isActive: true,
        notes: 'Outdoor patio seating'
      },
      {
        id: 'table-5',
        tableNumber: '5',
        capacity: 4,
        location: 'main dining',
        status: 'available',
        isActive: true,
        notes: 'Central dining table'
      },
      {
        id: 'table-6',
        tableNumber: '6',
        capacity: 8,
        location: 'private room',
        status: 'available',
        isActive: true,
        notes: 'Private dining room for special occasions'
      }
    ];

    for (const tableData of tables) {
      const existingTable = await tableRepository.findOne({ where: { id: tableData.id } });
      if (!existingTable) {
        const table = tableRepository.create(tableData);
        await tableRepository.save(table);
        console.log(`✅ Created restaurant table: ${tableData.tableNumber}`);
      }
    }
  }
}