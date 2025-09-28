import { ApiTags } from '@nestjs/swagger';
import { WebHookService } from './web-hook.service';
import { Controller, Get } from '@nestjs/common';

@ApiTags("Web-hook")
@Controller('web-hook')
export class WebHookController {
  constructor(private readonly webHookServices: WebHookService) {}
  @Get('razorpay')
  razorPay() {
    return this.webHookServices.razorPay();
  }
  @Get('stripe')
  stripe() {
    return this.webHookServices.stripe();
  }
  @Get('paypal')
  paypal() {
    return this.webHookServices.paypal();
  }
}
