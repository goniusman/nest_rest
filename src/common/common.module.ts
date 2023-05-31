import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
// import {AttachmentSchema} from './entities/attachment.entity';


@Module({
  // imports: [ MongooseModule.forFeature([{name: 'Attachment', schema: AttachmentSchema }])],
  controllers: [CommonController], 
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}
