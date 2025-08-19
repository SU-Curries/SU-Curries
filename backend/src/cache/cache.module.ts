import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './cache.service';
import { RedisCacheService } from './redis-cache.service';
import { MemoryCacheService } from './memory-cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_IMPLEMENTATION',
      useFactory: () => {
        // Use Redis in production, memory cache in development
        return process.env.NODE_ENV === 'production' 
          ? new RedisCacheService()
          : new MemoryCacheService();
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}