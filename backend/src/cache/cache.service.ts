import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean;
  tags?: string[];
}

export interface CacheImplementation {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
  invalidateByTag(tag: string): Promise<void>;
}

@Injectable()
export class CacheService {
  private readonly defaultTTL: number;
  private readonly keyPrefix: string;

  constructor(
    @Inject('CACHE_IMPLEMENTATION') private cache: CacheImplementation,
    private configService: ConfigService,
  ) {
    this.defaultTTL = this.configService.get('CACHE_TTL', 3600); // 1 hour default
    this.keyPrefix = this.configService.get('CACHE_KEY_PREFIX', 'sucurries:');
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.cache.get<T>(this.getKey(key));
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const cacheOptions = {
        ttl: options?.ttl || this.defaultTTL,
        ...options,
      };
      await this.cache.set(this.getKey(key), value, cacheOptions);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cache.delete(this.getKey(key));
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      const fullPattern = pattern ? this.getKey(pattern) : `${this.keyPrefix}*`;
      await this.cache.clear(fullPattern);
    } catch (error) {
      console.error(`Cache clear error for pattern ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await this.cache.exists(this.getKey(key));
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.cache.ttl(this.getKey(key));
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    try {
      await this.cache.invalidateByTag(tag);
    } catch (error) {
      console.error(`Cache invalidate by tag error for tag ${tag}:`, error);
    }
  }

  // Convenience methods for common cache patterns
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  async remember<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.defaultTTL,
  ): Promise<T> {
    return this.getOrSet(key, factory, { ttl });
  }

  // Cache warming
  async warm<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<void> {
    try {
      const value = await factory();
      await this.set(key, value, options);
    } catch (error) {
      console.error(`Cache warm error for key ${key}:`, error);
    }
  }

  // Batch operations
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const promises = keys.map(key => this.get<T>(key));
    return Promise.all(promises);
  }

  async mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    const promises = entries.map(entry => 
      this.set(entry.key, entry.value, entry.options)
    );
    await Promise.all(promises);
  }

  // Cache statistics (if supported by implementation)
  async getStats(): Promise<any> {
    // This would be implemented by the specific cache implementation
    return {};
  }

  // Common cache keys for the application
  static keys = {
    user: (id: string) => `user:${id}`,
    userProfile: (id: string) => `user:profile:${id}`,
    product: (id: string) => `product:${id}`,
    products: (filters: string) => `products:${filters}`,
    categories: () => 'categories',
    menu: () => 'menu',
    order: (id: string) => `order:${id}`,
    userOrders: (userId: string) => `user:orders:${userId}`,
    booking: (id: string) => `booking:${id}`,
    userBookings: (userId: string) => `user:bookings:${userId}`,
    analytics: (type: string, period: string) => `analytics:${type}:${period}`,
    session: (sessionId: string) => `session:${sessionId}`,
  };

  // Cache tags for invalidation
  static tags = {
    user: 'user',
    product: 'product',
    order: 'order',
    booking: 'booking',
    menu: 'menu',
    analytics: 'analytics',
  };
}