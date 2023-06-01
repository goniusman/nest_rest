import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './entities/tag.entity';

import {TypesService} from 'src/types/types.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Tag', schema: TagSchema}]),
    // TypesService
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
