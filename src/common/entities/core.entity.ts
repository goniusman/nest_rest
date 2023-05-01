import { Type, Transform } from 'class-transformer';

export class CoreEntity {

  @Transform(({ value }) => value.toString())
  // _id?: string;
  id?: number;
  @Type(() => Date)
  created_at: Date;
  @Type(() => Date)
  updated_at: Date;
}
