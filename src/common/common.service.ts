import { Get, Injectable } from '@nestjs/common';
import {Attachment} from './entities/attachment.entity';
import {InjectModel} from '@nestjs/mongoose';
import { CreateAttachmentDto} from './dto/create-attachment.dto';
import {Model} from 'mongoose';
import { GetAttachmentDto } from './dto/get-attachment.dto';
import { CommonHelper } from 'src/helper/commonHelper';

@Injectable()
export class CommonService {

  private readonly _commonHelper : CommonHelper = new CommonHelper();


  // constructor(@InjectModel('Attachment') private _attachment : Model<Attachment>){}

  
  //  async postAttachment(createAttachment: Attachment) : Promise<any> {
  //    try {
  //     // console.log(createAttachmentDto);
  //      const attachment = await new this._attachment(createAttachment)  

  //     //  attachment.prod_id = createAttachmentDto.prod_id
  //     //  attachment.thumbnail = createAttachmentDto.thumbnail
  //     //  attachment.url = createAttachmentDto.url.toString()
  //     //  attachment.original = createAttachmentDto.original
  //     attachment.save()
  //     return this._commonHelper.respone(true, "Success", attachment)

  //   } catch (error) {
  //     console.log(error.message);

  //     return this._commonHelper.respone(true, "Success", error)

  //   }
  // }


//   async getAttachments() : Promise<GetAttachmentDto[]>  {
//     try {

//       const attachment: Array<GetAttachmentDto> = await this._attachment.find()
//       return attachment;

//    } catch (error) {
//      return error.message;
//    }
//  }




}
