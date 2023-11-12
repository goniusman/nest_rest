import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { AddressesModule } from './addresses/addresses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { CommonModule } from './common/common.module';
import { CouponsModule } from './coupons/coupons.module';
import { FeedbackModule } from './feedbacks/feedbacks.module';
import { ImportsModule } from './imports/imports.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { QuestionModule } from './questions/questions.module';
import { RefundsModule } from './refunds/refunds.module';
import { ReportsModule } from './reports/reports.module';
import { ReviewModule } from './reviews/reviews.module';
import { SettingsModule } from './settings/settings.module';
import { ShippingsModule } from './shippings/shippings.module';
import { ShopsModule } from './shops/shops.module';
import { TagsModule } from './tags/tags.module';
import { TaxesModule } from './taxes/taxes.module';
import { TypesModule } from './types/types.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
// import { ProfilesModule } from './profiles/profiles.module';
import { WebHookModule } from './web-hook/web-hook.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { WithdrawsModule } from './withdraws/withdraws.module';

import { MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import config from './config/cloudinary';
import database from './config/database';
import env from './config/env';
import mailer from './config/mailer';
 
// import { UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ContactusModule } from './contactus/contactus.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MessagesModule } from './messages/messages.module';
import { StoreNoticesModule } from './store-notices/store-notices.module';
import { RequestLoggerMiddleware } from './utils/Middleware/Request-Middleware.logger';

const { db, redis } = env();

const mongo = db.host ? `${db.host}:${db.port}` : 'mongodb://127.0.0.1:27018';

// console.log(database.port);
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: redisStore,
      socket: {
        host: redis.host, // This is ignored and `127.0.0.1` is used instead
        port: Number(redis.port),
      },
      // host: 'localhost',
      // port: 6379,
      // username: process.env.REDIS_USERNAME, // new property
      // password: process.env.REDIS_PASSWORD, // new property
      // no_ready_check: true, // new property
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config, database, mailer, env],
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    // MongooseModule.forRoot('mongodb://<username>:<password>@localhost:27017',{dbName: 'studentdb'}),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
    //   dbName: 'pickbazar',
    //   connectionFactory: (connection) => {
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     connection.plugin(require('mongoose-slug-generator'));
    //     return connection;
    //   }

    // }),

   // MongooseModule.forRoot(`mongodb://pickbazar:OsmanGoni@36.255.70.224:27017?authSource=pickbazar`, {
      MongooseModule.forRoot(`mongodb://pickbazar:OsmanGoni@127.0.0.1:27017?authSource=pickbazar`, {
      dbName: 'pickbazar',
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-slug-generator'));
        return connection;
      },
    }),
    // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2022-11-15',
    }),
    // MulterModule.register({
    //   dest: './files',
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files')
    // }),
    MailModule,
    UsersModule,
    // ProfilesModule,
    CommonModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    AnalyticsModule,
    AttributesModule,
    ShippingsModule,
    TaxesModule,
    TagsModule,
    ShopsModule,
    TypesModule,
    WithdrawsModule,
    UploadsModule,
    SettingsModule,
    CouponsModule,
    AddressesModule,
    ImportsModule,
    AuthModule,
    RefundsModule,
    AuthorsModule,
    ManufacturersModule,
    NewslettersModule,
    ReviewModule,
    QuestionModule,
    WishlistsModule,
    ReportsModule,
    FeedbackModule,
    PaymentMethodModule,
    PaymentIntentModule,
    WebHookModule,
    PaymentModule,
    CloudinaryModule,
    ContactusModule,
    MailModule,
    StoreNoticesModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [
    //   {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    MailService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(cors()).forRoutes('*')
//   }
// }
