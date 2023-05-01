import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import mongoose, { Types } from 'mongoose';
import {Prop} from '@nestjs/mongoose';
// import {Attachment} from 'src/common/schemas/attachment.schema';
// import {IsString, isNotEmpty} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
export class CreateCategoryDto extends PickType(Category, [
  'name',
  // 'type',
  // 'details',
  // 'parent',
  // 'icon',
  // 'file',
  // 'language',
]) {

  @ApiProperty({ required: true, type: String})
  name: string;

  @ApiProperty({ required: false, type: String})
  slug?: string;

  // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})  
  @Prop({ required: false, type: Types.ObjectId })
  parent?: Types.ObjectId | null;

  // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]})
  // @Prop({ required: false, type: [Types.ObjectId], default:null, defaultValue:null})
  // children?: Category[] = []; 

  @ApiProperty({required: false})
  details?: string;

  @Prop({required: false, type:String })  
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;
    
  // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]})
  // products?: Product[];

  // @Prop({required: false,type: mongoose.Schema.Types.ObjectId, ref: 'Attachment'})  

  // @Prop({required: false})  
  // icon?: string;

}
