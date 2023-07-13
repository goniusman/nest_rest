import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose"

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './gurd/jwt.strategy';
import { UsersModule } from "../users/users.module";
// import { UsersService } from "../users/users.service";
import { UserSchema } from "../users/entities/user.entity"
import { LocalStrategy } from './local/local.strategy';
// import { SessionSerializer } from "./local/session.serializer"
// import {CommonModule} from 'src/common/common.module';
import {jwtConstants} from './gurd/constants'
import { ShopsModule } from 'src/shops/shops.module';
import { MailModule } from 'src/mail/mail.module';

@Module({

  imports: [
    UsersModule, 
    ShopsModule,
    // PassportModule.register({ session: true }), 
    PassportModule, 
    JwtModule.register({
      // global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }), 
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
