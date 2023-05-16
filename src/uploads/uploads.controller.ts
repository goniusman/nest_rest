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
    let attachments: any[] 
    if (attachment.length === 0) return []
    if(attachment.length > 1) {
      attachment.forEach(async e=>{
       const response = await this.uploadImageToCloudinary(e )
       if(response.original_filename.length > 0) attachments.push(response)
         
      })
    }else{
      const response = await this.uploadImageToCloudinary(attachment[0])
      if(response) attachments.push(response) 
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


  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

}
