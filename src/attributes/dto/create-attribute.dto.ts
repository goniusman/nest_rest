import { PickType } from '@nestjs/swagger';
import { Attribute } from '../entities/attribute.entity';

export class CreateAttributeDto extends PickType(Attribute, [
  'name',
  'shop',
  'language',
]) {
  values: AttributeValueDto[];
}

export class AttributeValueDto {
  id: number;
  value: string;
  meta?: string;
  language?: string;
}
