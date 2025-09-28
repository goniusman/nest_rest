import { Controller, Get } from '@nestjs/common';
import { PaymentIntentService } from './payment-intent.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("payment-intent")
@Controller('payment-intent')
export class PaymentIntentController {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}
  @Get()
  getPaymentIntent() {
    return this.paymentIntentService.getPaymentIntent();
  }
}
