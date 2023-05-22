import {Prop, Schema} from '@nestjs/mongoose';
import { Type, Transform } from 'class-transformer';

@Schema()
export class CoreEntity {

  @Transform(({ value }) => value.toString())
  // _id?: string;
  id?: number;
  @Prop()
  @Type(() => Date)
  created_at: Date;
  
  @Prop()
  @Type(() => Date)
  updated_at: Date;
}






// import { Prop, Schema } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// // import { TimeStamps } from './timestamps.schema';

// export type CoreEntityDocument = CoreEntity & Document;

// @Schema()
// export class CoreEntity {
//   @Prop({
//     type: Types.ObjectId,
//     required: true,
//     default: Types.ObjectId,
//   })
//   nonce: Types.ObjectId;

//   @Prop({required: false})
//   id?: number;


//   // @Prop()
//   // timestamps: TimeStamps;
// }



