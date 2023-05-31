import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import {JwtAuthGuard} from './auth/gurd/jwt-auth.guard';
// import {LocalAuthGuard} from './auth/gurd/local-auth.guard';
// import {AuthGuard} from './auth/local/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
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

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Marvel')
    .setDescription('Marvel Mock API')
    .setVersion('1.0')
    .addTag('marvel')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
