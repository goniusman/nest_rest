import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentIntentSchema } from 'src/payment-intent/entries/payment-intent.entity';
import { PaymentGateWaySchema } from 'src/payment-method/entities/payment-gateway.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { OrderStatusSchema } from './entities/order-status.entity';
import { OrderFilesSchema, OrderSchema } from './entities/order.entity';
import {
  DownloadInvoiceController,
  OrderExportController,
  OrderFilesController,
  OrdersController,
  OrderStatusController,
} from './orders.controller';
import { OrdersService } from './orders.service';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderFiles', schema: OrderFilesSchema },
      { name: 'OrderStatus', schema: OrderStatusSchema },
      { name: 'PaymentGateWay', schema: PaymentGateWaySchema },
      { name: 'PaymentIntent', schema: PaymentIntentSchema },
    ]),
    AuthModule,
    PaymentModule,
    SettingsModule,
  ],
  controllers: [
    OrdersController,
    OrderStatusController,
    OrderFilesController,
    OrderExportController,
    DownloadInvoiceController,
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
