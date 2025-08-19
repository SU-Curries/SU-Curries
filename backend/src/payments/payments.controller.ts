import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService, CreatePaymentIntentDto, PaymentIntent } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto): Promise<PaymentIntent> {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post('confirm/:id')
  async confirmPayment(@Param('id') paymentIntentId: string): Promise<PaymentIntent> {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Get(':id')
  async getPaymentIntent(@Param('id') paymentIntentId: string): Promise<PaymentIntent> {
    return this.paymentsService.getPaymentIntent(paymentIntentId);
  }
}