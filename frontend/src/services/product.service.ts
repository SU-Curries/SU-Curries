import { apiService } from './api.service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stockQuantity: number;
  images?: string[];
  image?: string;
  featuredImage?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  isFeatured: boolean;
  slug: string;
  categoryId: string;
  category?: string;
  spiceLevel?: number;
  dietaryTags?: string[];
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  inStock?: boolean;
  ingredients?: string;
  nutritionalInfo?: string;
  cookingInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Product service for handling product catalog operations
 */
export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  /**
   * Get singleton instance of ProductService
   */
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get all products with optional filtering
   */
  public async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    try {
      // Skip API call and use mock data directly for demo purposes
      // In a real application, we would try the API first
      
      // For demo purposes or as fallback, use mock data
      const { mockProducts } = await import('../data/mockData');
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.categoryId) {
        filteredProducts = filteredProducts.filter(product => product.categoryId === params.categoryId);
      }
      
      // Apply price filters
      if (params?.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
      }
      
      if (params?.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
        filteredProducts.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Product];
          const bValue = b[params.sortBy as keyof Product];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder * (aValue - bValue);
          }
          return 0;
        });
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit)
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  public async getProduct(id: string): Promise<Product> {
    try {
      // Try to get from API with caching enabled
      try {
        return await apiService.get<Product>(`/products/${id}`, {
          useCache: true,
          cacheTTL: 10 * 60 * 1000 // 10 minutes cache for product details
        });
      } catch (apiError) {
        console.warn(`API request for product ${id} failed, falling back to mock data:`, apiError);
        // Fall back to mock data if API fails
      }
      
      // For demo purposes or as fallback, use mock data
      const { mockProducts } = await import('../data/mockData');
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a single product by ID (alias for backward compatibility)
   */
  public async getProductById(id: string): Promise<Product> {
    return this.getProduct(id);
  }

  /**
   * Get a single product by slug
   */
  public async getProductBySlug(slug: string): Promise<Product> {
    try {
      // For demo purposes, use mock data
      const { mockProducts } = await import('../data/mockData');
      const product = mockProducts.find(p => p.slug === slug);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error(`Failed to fetch product with slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  public async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      // For demo purposes, use mock data
      const { mockProducts } = await import('../data/mockData');
      return mockProducts.filter(product => product.isFeatured).slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  public async getCategories(): Promise<Category[]> {
    try {
      // Try to get from API with caching enabled
      try {
        return await apiService.get<Category[]>('/categories', {
          useCache: true,
          cacheTTL: 30 * 60 * 1000 // 30 minutes cache for categories
        });
      } catch (apiError) {
        console.warn('API request for categories failed, falling back to mock data:', apiError);
        // Fall back to mock data if API fails
      }
      
      // For demo purposes or as fallback, use mock data
      const { mockCategories } = await import('../data/mockData');
      return mockCategories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * Get active categories
   */
  public async getActiveCategories(): Promise<Category[]> {
    try {
      // For demo purposes, use mock data
      const { mockCategories } = await import('../data/mockData');
      return mockCategories.filter(category => category.isActive);
    } catch (error) {
      console.error('Failed to fetch active categories:', error);
      throw error;
    }
  }

  /**
   * Get a single category by ID
   */
  public async getCategoryById(id: string): Promise<Category> {
    try {
      // For demo purposes, use mock data
      const { mockCategories } = await import('../data/mockData');
      const category = mockCategories.find(c => c.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.error(`Failed to fetch category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a single category by slug
   */
  public async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      // For demo purposes, use mock data
      const { mockCategories } = await import('../data/mockData');
      const category = mockCategories.find(c => c.slug === slug);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.error(`Failed to fetch category with slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  public async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      // For demo purposes, create a mock product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: data.name || 'New Product',
        description: data.description || '',
        price: data.price || 0,
        sku: data.sku || `SKU-${Date.now()}`,
        stockQuantity: data.stockQuantity || 0,
        status: data.status || 'active',
        isFeatured: data.isFeatured || false,
        slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
        categoryId: data.categoryId || 'cat-1',
        category: data.category || 'General'
      };
      return newProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  /**
   * Update a product
   */
  public async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      // For demo purposes, return updated product
      const { mockProducts } = await import('../data/mockData');
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { ...product, ...data };
    } catch (error) {
      console.error(`Failed to update product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  public async deleteProduct(id: string): Promise<void> {
    try {
      // For demo purposes, just log the deletion
      console.log(`Product ${id} deleted`);
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all products for admin
   */
  public async getAdminProducts(): Promise<{ products: Product[] }> {
    try {
      // For demo purposes, use mock data
      const { mockProducts } = await import('../data/mockData');
      return { products: mockProducts };
    } catch (error) {
      console.error('Failed to fetch admin products:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const productService = ProductService.getInstance();