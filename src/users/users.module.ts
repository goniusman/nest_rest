import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {  UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserSchema } from './entities/user.entity';
import {UploadsService} from 'src/uploads/uploads.service';
import {UploadsModule} from 'src/uploads/uploads.module';
import { ProfileSchema } from './entities/profile.entity';
// import Logger from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {name: 'Profile', schema: ProfileSchema}]),
    CloudinaryModule,
    UploadsModule,
    // Logger
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
