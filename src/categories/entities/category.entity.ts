import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

// import { Attachment } from 'src/common/entities/attachment.entity';
// import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
// import { Type } from 'src/types/entities/type.entity';

@Schema({timestamps: true})
export class Category {
  id: number;

  @Prop({required: true})  
  name: string;

  @Prop({required: false})  
  slug?: string;

  @Prop({required: false})  
  details?: string;

  // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})  
  @Prop({ required: false, type: Types.ObjectId, defaultValue: null })
  parent?: Types.ObjectId | null;

  // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]})
  // @Prop({ required: false, type: [Types.ObjectId], default:null, defaultValue:null })
  // children?: Category[] =[];
 
  
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]})
  products?: Product[];
   
  // @Prop({required: false, type:String})  
  // file?: Express.Multer.File;

  // type?: Type;
  
  // @Prop({required: false})  
  // icon?: string;

  // language: string;
  // translated_languages: string[];

}



const CategorySchema = SchemaFactory.createForClass(Category)

export {CategorySchema}