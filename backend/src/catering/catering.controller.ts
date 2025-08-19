import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CateringService } from './catering.service';

@ApiTags('catering')
@Controller('catering')
export class CateringController {
  constructor(private readonly cateringService: CateringService) {}

  @Get()
  @ApiOperation({ summary: 'Get catering information' })
  @ApiResponse({ status: 200, description: 'Catering information retrieved successfully' })
  findAll() {
    return this.cateringService.findAll();
  }
}