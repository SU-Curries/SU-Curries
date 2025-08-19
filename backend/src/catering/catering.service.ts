import { Injectable } from '@nestjs/common';

@Injectable()
export class CateringService {
  findAll() {
    return {
      message: 'Catering service coming soon',
      services: [],
    };
  }
}