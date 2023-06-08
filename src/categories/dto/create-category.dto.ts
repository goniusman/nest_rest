import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import mongoose, { Types } from 'mongoose';
import {Prop} from '@nestjs/mongoose';
import {IsNotEmpty, IsString, isNotEmpty} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import {Attachment} from 'src/common/entities/attachment.entity';
export class CreateCategoryDto extends PickType(Category, [
  'name',
  'type',
  'details',
  'parent',
  'icon',
  'image',
  'language',
]) {

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ required: true, type: String})
  // name: string;

  // // @IsNotEmpty()
  // // @ApiProperty({ required: false, type: String})
  // // slug?: string;

  // // @IsNotEmpty()
  // @ApiProperty({type: Category})  
  // parent?: Category;

  // // @ApiProperty({type: [{type: Category}], default:[]})
  // children?: Category[] = []; 

  // @ApiProperty({required: false})
  // details?: string;

  // // @ApiProperty({required: false, type:Attachment })  
  // image?: Attachment;

  // // @ApiProperty({required: false, type:Product, default:[] })  
  // products?: Product[] = [];

  // // @ApiProperty({required: false, type:String })  
  // icon?: string;

}
