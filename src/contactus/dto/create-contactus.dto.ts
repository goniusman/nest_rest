import { PickType } from '@nestjs/swagger';
import { Contactus } from '../entities/contactus.entity';

export class CreateContactusDto extends PickType(Contactus, [
 'status',
 'updatedBy'
]) {}
