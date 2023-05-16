import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {  UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserSchema } from './schema/user.schema';
// import { ProfileSchema } from './schema/profile.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CloudinaryModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
