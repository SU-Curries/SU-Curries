import { Injectable } from '@nestjs/common';
import { CacheImplementation, CacheOptions } from './cache.service';

interface CacheItem<T> {
  value: T;
  expiry: number;
  tags?: string[];
}

@Injectable()
export class MemoryCacheService implements CacheImplementation {
  private cache: Map<string, CacheItem<any>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.removeFromTagIndex(key, item.tags);
      return null;
    }
    
    return item.value;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = (options?.ttl || 3600) * 1000; // Convert to milliseconds
    const expiry = Date.now() + ttl;
    
    // Remove old entry from tag index if it exists
    const oldItem = this.cache.get(key);
    if (oldItem) {
      this.removeFromTagIndex(key, oldItem.tags);
    }
    
    const item: CacheItem<T> = {
      value,
      expiry,
      tags: options?.tags,
    };
    
    this.cache.set(key, item);
    
    // Add to tag index
    if (options?.tags) {
      this.addToTagIndex(key, options.tags);
    }
  }

  async delete(key: string): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.removeFromTagIndex(key, item.tags);
    }
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear();
      this.tagIndex.clear();
      return;
    }
    
    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    for (const key of keysToDelete) {
      await this.delete(key);
    }
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.removeFromTagIndex(key, item.tags);
      return false;
    }
    
    return true;
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key);
    
    if (!item) {
      return -2; // Key doesn't exist
    }
    
    const remaining = item.expiry - Date.now();
    
    if (remaining <= 0) {
      this.cache.delete(key);
      this.removeFromTagIndex(key, item.tags);
      return -2; // Key expired
    }
    
    return Math.ceil(remaining / 1000); // Return seconds
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = this.tagIndex.get(tag);
    
    if (!keys) {
      return;
    }
    
    for (const key of keys) {
      await this.delete(key);
    }
    
    this.tagIndex.delete(tag);
  }

  private addToTagIndex(key: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  private removeFromTagIndex(key: string, tags?: string[]): void {
    if (!tags) {
      return;
    }
    
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
  }

  // Cleanup expired entries periodically
  startCleanup(): void {
    setInterval(() => {
      this.cleanupExpired();
    }, 60000); // Run every minute
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      const item = this.cache.get(key);
      this.cache.delete(key);
      if (item) {
        this.removeFromTagIndex(key, item.tags);
      }
    }
  }

  // Get cache statistics
  getStats(): any {
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expiredCount++;
      }
      totalSize += JSON.stringify(item.value).length;
    }
    
    return {
      totalKeys: this.cache.size,
      expiredKeys: expiredCount,
      totalTags: this.tagIndex.size,
      approximateSize: totalSize,
      hitRate: 0, // Would need to track hits/misses
    };
  }
}