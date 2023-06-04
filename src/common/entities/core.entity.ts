import {Prop, Schema} from '@nestjs/mongoose';
import { Type, Transform } from 'class-transformer';

@Schema({timestamps:true})
export class CoreEntity {


  // constructor(sche: any) {
  //     super(sche);
  //     this.set('toJSON', {
  //     virtuals: true,
  //     transform: (doc, converted) => {
  //         delete converted._id;
  //     }
  //     });
  // }
  // @Prop({
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   default: mongoose.Types.ObjectId,
  // })
  // nonce: mongoose.Types.ObjectId;




  @Transform(({ value }) => value.toString())
  // _id?: string;
  id?: number;
  
  @Prop({type: Date, required: false})
  created_at: Date;
  
  @Prop({type: Date, required: false})
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



