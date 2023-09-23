import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {CoreEntity} from 'src/common/entities/core.entity';
import {User} from 'src/users/entities/user.entity';


@Schema({timestamps: true})
export class Contactus extends CoreEntity {

  @Prop({type: String, required: false})
  name: string;

  @Prop({type: String, required: true})
  email?: string; 
  
  @Prop({type: String, required: false})
  subject?: string;

  @Prop({type: String, required: true})
  description?: string;

  @Prop({type: Boolean, required: false, default: false})
  status: boolean; 
  
  @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: false})
  updatedBy?: User;

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false})
  translated_languages: string[];
}


const ContactusSchema = SchemaFactory.createForClass(Contactus)

export {ContactusSchema};







