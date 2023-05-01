import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {Attachment} from './entities/attachment.entity';
import {CommonService} from './common.service';
import {CreateAttachmentDto} from './dto/create-attachment.dto';
import { GetAttachmentDto } from './dto/get-attachment.dto';
import {Request} from 'express'

@Controller('common')
export class CommonController {
   
  constructor(private readonly commonService : CommonService) {}
  

  @Post('/attachment')
  async insertAttachment(@Body() createAttachmentDto: CreateAttachmentDto) : Promise<any> {
    console.log(createAttachmentDto);
    return this.commonService.postAttachment(createAttachmentDto)

  }


  @Get('/attachment')
  async getAttachments(@Req() request: Request): Promise <GetAttachmentDto[]> {
    // console.log(request);
    const attachmets: Array<GetAttachmentDto> = await this.commonService.getAttachments()
    return attachmets

  }

}
