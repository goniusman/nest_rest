import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {ContactusSchema} from './entities/contactus.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Contactus', schema: ContactusSchema}])
  ],
  controllers: [ContactusController],
  providers: [ContactusService]
})
export class ContactusModule {}
