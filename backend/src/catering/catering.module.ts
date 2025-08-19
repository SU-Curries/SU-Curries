import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CateringRequest } from './entities/catering-request.entity';
import { CateringController } from './catering.controller';
import { CateringService } from './catering.service';

@Module({
  imports: [TypeOrmModule.forFeature([CateringRequest])],
  controllers: [CateringController],
  providers: [CateringService],
  exports: [CateringService],
})
export class CateringModule {}