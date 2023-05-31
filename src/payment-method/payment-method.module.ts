import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SettingsModule } from 'src/settings/settings.module';
import {
  PaymentMethodController,
  SavePaymentMethodController,
  SetDefaultCartController,
} from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethodSchema } from './entities/payment-method.entity';
import { PaymentGateWaySchema } from './entities/payment-gateway.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'PaymentMethod', schema: PaymentMethodSchema},
      {name: 'PaymentGateWay', schema: PaymentGateWaySchema}
    ]),
    AuthModule, PaymentModule, SettingsModule],
  controllers: [
    PaymentMethodController,
    SetDefaultCartController,
    SavePaymentMethodController,
  ],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
