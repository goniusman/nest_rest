import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import {CloudinaryModule} from 'src/cloudinary/cloudinary.module';
import {UploadsSchema} from './schema/Uploads';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Uploads', schema: UploadsSchema }]),
    CloudinaryModule
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService]

})
export class UploadsModule {}
