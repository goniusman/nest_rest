import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AppModule } from './app.module';
// import session from 'express-session';
// import passport from 'passport';
// import {JwtAuthGuard} from './auth/gurd/jwt-auth.guard';
// import {LocalAuthGuard} from './auth/gurd/local-auth.guard';
// import {AuthGuard} from './auth/local/auth.guard';

import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,

    logger: WinstonModule.createLogger({
      transports: [
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '10d', // will keep log until they are older than 30 days
        }),

        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '10d',
        }),

        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),

    // snapshot: true,
  });

  // const sess = session.Session
  // app.useGlobalGuards(new JwtAuthGuard())
  // app.use(
  //   session({
  //     secret: 'keyboard',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  ///// exception handler
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Marvel')
    .setDescription('Marvel Mock API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Marvel')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT || 5000;

  await app.listen(PORT);

  console.log(`Application is running on : ${await app.getUrl()}`);
}
bootstrap();
