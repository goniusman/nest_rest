import { PartialType } from '@nestjs/swagger';
import { CreateContactusDto } from './create-contactus.dto';

export class UpdateContactusDto extends PartialType(CreateContactusDto) {}
