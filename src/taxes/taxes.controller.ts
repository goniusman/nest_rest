import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { GetTaxesDto } from './dto/get-taxes.dto';
import { ApiTags } from '@nestjs/swagger';
// import { TransformInterceptor } from 'src/utils/Response.Interceptor';

@ApiTags("Taxes")
@Controller('taxes')
// @UseInterceptors(TransformInterceptor)
export class TaxesController {

  private readonly logger = new Logger();

  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@Body() createTaxDto: CreateTaxDto) {
    try {
      
      return this.taxesService.create(createTaxDto);
    // }else{
    //   throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
    // }

    } catch (error) {
      this.logger.error(`Taxes/create failed: ${error} user is ${createTaxDto?.name}`)
      throw error
    }

  } 

  @Get()
  findAll(@Query() getTaxesDto: GetTaxesDto) {
    try {
      return this.taxesService.findAll();

    } catch (error) {
      this.logger.error(`Taxes/findAll failed: ${error}}`)
      throw error
    }

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.taxesService.findOne(id);

    } catch (error) {
      this.logger.error(`Taxes/findOne failed: ${error}}`)
      throw error
    }

  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
    try {
      return this.taxesService.update(id, updateTaxDto);

    } catch (error) {
      this.logger.error(`Taxes/update failed: ${error}}`)
      throw error
    }
   
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.taxesService.remove(id);
    } catch (error) {
      this.logger.error(`Taxes/remove failed: ${error}}`)
      throw error
    }

  }
}
