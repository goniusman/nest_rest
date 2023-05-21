import { ApiProperty, PickType } from "@nestjs/swagger";
import { Attachment } from "../entities/attachment.entity";
import { Prop } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Category } from "src/categories/entities/category.entity";
import { IsNotEmpty } from "class-validator";
// import { AttachmentDocument } from "../entities/attachment.entity";



export class CreateAttachmentDto extends PickType(Attachment, ['id']) {
      
  @Prop({ required: false })
  image_dir: string;

  @Prop({ required: false })
  thumbnail: string;

  @Prop({ required: false })
  original: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  id: string;

}