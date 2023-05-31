import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';

@Schema({ timestamps: true })
export class Feedback extends CoreEntity {

  @Prop({ required: true, type: String })
  user_id: string;

  @Prop({ required: false, type: String })
  model_type: string;

  @Prop({ required: false, type: String })
  model_id: string;

  @Prop({ required: false, type: Boolean })
  positive?: boolean;

  @Prop({ required: false, type: Boolean })
  negative?: boolean;
  
}

const FeedbackSchema = SchemaFactory.createForClass(Feedback)

export {FeedbackSchema}

