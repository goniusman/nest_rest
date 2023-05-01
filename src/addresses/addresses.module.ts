import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { AddressSchema } from './schema/address.schema';
import { UserAddressSchema } from './schema/useraddress.Schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Address', schema: AddressSchema },
      { name: 'UserAddress', schema: UserAddressSchema },
    ]),
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
