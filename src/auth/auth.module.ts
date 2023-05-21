import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose"

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from "../users/users.module";
// import { UsersService } from "../users/users.service";
import { UserSchema } from "../users/schema/user.schema"
// import { LocalStrategy } from './local/local.strategy';
// import { SessionSerializer } from "./local/session.serializer"
// import {CommonModule} from 'src/common/common.module';
import {jwtConstants} from './constants'

@Module({

  imports: [
    UsersModule, 
    // PassportModule.register({ session: true }), 
    PassportModule, 
    JwtModule.register({
      // global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }), 
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
