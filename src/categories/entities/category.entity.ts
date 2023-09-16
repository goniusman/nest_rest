import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {Attachment} from 'src/common/entities/attachment.entity';
import {CoreEntity} from 'src/common/entities/core.entity';
import {Type} from 'src/types/entities/type.entity';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Category extends CoreEntity {

  @Prop({required: false, type:Number})
  id: number;

  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }

  @Prop({required: true, type:String, description: "name"})  
  name: string;

  @Prop({required: false, type:String, unique:true})  
  slug?: string;

  @Prop({required: false, type:String})  
  details?: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})  
  parent?: Category

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}], default: []})
  children?: Category[] =[];
  
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Type'})  
  type?: Type;
  
  @Prop({required: false, type:String})  
  icon?: string;
  
  @Prop({required: false, type: Attachment, default:{}})   
  image?: Attachment;
  
  @Prop({required: false, type:String})  
  language: string;

  @Prop({required: false, type: [String], default:["en"]})  
  translated_languages: string[] = [];


}

const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
}) 

export {CategorySchema};


