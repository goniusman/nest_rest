import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


export class Social {
  type: string;
  link: string;
}



@Schema({ timestamps: true })
export class Profile extends CoreEntity {

  @Prop({  type: Attachment , required: false})
  avatar?: Attachment;

  @Prop({ required: false, type: String })
  bio?: string;

  @Prop({ type: Social, default: [] })
  socials?: Social[] = [];

  @Prop({ required: false, type: String })
  contact?: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  customer?: User;

}


const ProfileSchema = SchemaFactory.createForClass(Profile)

export {ProfileSchema}

