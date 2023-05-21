import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import {CloudinaryService} from 'src/cloudinary/cloudinary.service';
import {Attachment} from 'src/common/entities/attachment.entity';
import {Uploads} from './schema/Uploads';

@Controller('attachments')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private cloudinary : CloudinaryService
    ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]'))
  async uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
    // console.log(attachment);
    const attachments: Attachment[] = []
    if (attachment.length === 0) return []
    if(attachment.length > 1) {
      attachment.forEach(async e=>{
       const response = await this.cloudinary.uploadImageToCloudinary(e )
      //  if(response.original_filename.length > 0) attachments.push(response)
         
      })
    }else{
      const response = await this.cloudinary.uploadImageToCloudinary(attachment[0])
      const uploadedData = await this.uploadsService.create(response)
      const attacheData = await this.mapingTOAttach(uploadedData)
       attachments.push(attacheData) 
    }

    // return [
      // {
      //   id: '883',
      //   original:
      //     'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/aatik-tasneem-7omHUGhhmZ0-unsplash%402x.png',
      //   thumbnail:
      //     'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/conversions/aatik-tasneem-7omHUGhhmZ0-unsplash%402x-thumbnail.jpg',
      // },
    // ];

    return attachments;
  }


  async mapingTOAttach(data: any): Promise<Attachment> {
 
    try {
         const attachment = await new Attachment();
        attachment.original = data.secure_url;
        attachment.thumbnail = data.secure_url;
        attachment.id = data._id.toString();
        attachment.image_dir = data.resource_type

        return attachment;
    } catch (error) {
      console.log(error.message);
    }
 
  }



}
