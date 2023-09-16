import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateTagDto} from './dto/create-tag.dto';
import {GetTagsDto,TagPaginator} from './dto/get-tags.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {TagsService} from './tags.service';

@Controller('tags')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagsController {

  private readonly logger = new Logger() 

  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
     
    try {
      const exist = await this.tagsService.findOne(createTagDto.name)

      if(!exist){
           return await this.tagsService.createTag(createTagDto);
        } else {
          throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST)
       } 

    } catch (error) {

      this.logger.error(`tagsController/create error is + ${error.message}`)
      throw error;

    }
   
  }

  @Get()
  async findAll(@Query() query: GetTagsDto): Promise<TagPaginator> {
    try {
      
      return this.tagsService.findAll(query);
    } catch (error) {
      this.logger.error(`tagsController/findAll error is + ${error.message}`)
      throw error;
    }
  }

  @Get(':param')
  findOne(@Param('param') param: string, @Query('language') language: string) {
    try {
      
      return this.tagsService.findOne(param);
    } catch (error) {
      this.logger.error(`tagsController/findOne error is + ${error.message}`)
      throw error;
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    try {
      
      return this.tagsService.update(id, updateTagDto); 
    } catch (error) {
      this.logger.error(`tagsController/Update error is + ${error.message}`)
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      
      return this.tagsService.remove(id);
    } catch (error) {
      this.logger.error(`tagsController/remove error is + ${error.message}`)
      throw error;
    }
  }
}
