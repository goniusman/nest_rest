import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose"

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { UserSchema } from "../users/schema/user.schema"
import { LocalStrategy } from './local.auth';
import { SessionSerializer } from "./session.serializer"

@Module({

  imports: [UsersModule, PassportModule.register({ session: true }), JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '60s' },
  }), MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
