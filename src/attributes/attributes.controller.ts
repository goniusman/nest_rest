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
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { AttributePaginator, GetAttributesArgs } from './dto/get-attributes.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Controller('attributes')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttributesController {

  private readonly logger = new Logger()
  constructor(private readonly attributesService: AttributesService) { }

  @Post()
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    try {
 
      // const existAttribute = await this.attributesService.findByName(createAttributeDto.name)
      // if (!existAttribute) {

        return await this.attributesService.create(createAttributeDto);
      // } else {
      //   throw new HttpException('Attributes Already Exists', HttpStatus.BAD_REQUEST)

      // }

    } catch (error) {

      this.logger.error(`attributeController/create error is + ${error.message}`)
      throw error;

    }


  }

  @Get()
  async findAll(@Query() query: GetAttributesArgs): Promise<AttributePaginator> {
console.log(query);
    try {

      return await this.attributesService.findAll(query);


    } catch (error) {

      this.logger.error(`attributeController/findAll error is + ${error.message}`)
      throw error;

    }

  }

  @Get(':param')
  async findOne(@Param('param') param: string) {

    try {

      const attribute = await this.attributesService.findOne(param);
      if (attribute) {
        return attribute;
      } else {
        throw new HttpException('There are no attributes', HttpStatus.NOT_FOUND)

      }

    } catch (error) {

      this.logger.error(`attributeController/findOne error is + ${error.message}`)
      throw error;

    }



  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {

    try {

      const attribute = await this.attributesService.update(id, updateAttributeDto);
      if (attribute) {
        return attribute;
      } else {
        throw new HttpException('Not Update', HttpStatus.BAD_REQUEST)

      }

    } catch (error) {

      this.logger.error(`attributeController/update error is + ${error.message}`)
      throw error;

    }



  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    try {
      const attribute = await this.attributesService.findById(id);
      if (attribute) {
        return await this.attributesService.remove(id);
      } else {
        throw new HttpException('Attribute Not Found', HttpStatus.NOT_FOUND)

      }

    } catch (error) {

      this.logger.error(`attributeController/update error is + ${error.message}`)
      throw error;

    }

  }


}
