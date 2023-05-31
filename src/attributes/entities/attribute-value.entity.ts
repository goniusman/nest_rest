import { CoreEntity } from 'src/common/entities/core.entity';
import { Attribute } from './attribute.entity';
import mongoose from 'mongoose';

export class AttributeValue extends mongoose.Document {
  shop_id: number;
  value: string;
  meta?: string;
  attribute: Attribute;
}
