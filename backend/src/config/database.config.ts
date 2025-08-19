import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get('DB_TYPE') || 'postgres';
  
  // Use SQLite for development if specified
  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get('DB_PATH') || './su_curries_db.sqlite',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: true,
      logging: configService.get('NODE_ENV') === 'development',
    };
  }
  
  // Default PostgreSQL configuration
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false, // Disabled to prevent conflicts
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
};