import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import {TypeSchema} from './entities/type.entity';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Type', schema: TypeSchema}])
  ],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {} 
