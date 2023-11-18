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
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import {
  GetManufacturersDto,
  ManufacturerPaginator,
} from './dto/get-manufactures.dto';
import { GetTopManufacturersDto } from './dto/get-top-manufacturers.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from './entities/manufacturer.entity';
import { ManufacturersService } from './manufacturers.service';

@Controller('manufacturers')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ManufacturersController {
  private readonly logger = new Logger() 
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createManuFacturer(@Body() createManufactureDto: CreateManufacturerDto) {

    try {

      const existManufac = await this.manufacturersService.getManufacturesByName(createManufactureDto.name)
      if(!existManufac){

        return await this.manufacturersService.create(createManufactureDto);
      }else{
        throw new HttpException('Manufacture Already Exists', HttpStatus.BAD_REQUEST)
      }

    } catch (error) {

      this.logger.error(`manufacturerController/createManuFacturer error is + ${error.message}` )
      throw error;

    }

  }

  @Get()
  async getManufactures(
    @Query() query: GetManufacturersDto,
  ): Promise<ManufacturerPaginator> {

    try {


      const manuFacturer = this.manufacturersService.getManufactures(query);
      if(manuFacturer){
        return manuFacturer;
      }else{
        throw new HttpException('There are no manuFacturer', HttpStatus.NOT_FOUND)
  
      }

    } catch (error) {

      this.logger.error(`manuFacturerController/getManufactures error is + ${error.message}` )
      throw error;

    }
  
  } 

  @Get(':slug')
  async getManufactureBySlug(
    @Param('slug') slug: string,
  ): Promise<Manufacturer> {

    try {

      const manuFacturer = await this.manufacturersService.getManufacturesBySlug(slug);
      if(manuFacturer){
        return manuFacturer;
      }else{
        throw new HttpException('There are no manuFacturer', HttpStatus.NOT_FOUND)
  
      }

    } catch (error) {

      this.logger.error(`manuFacturerController/findOne error is + ${error.message}` )
      throw error;

    }

  }

  @Put(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {

    try {
      

      const manufacturers = this.manufacturersService.update(id, updateManufacturerDto);
      if(manufacturers){
        return manufacturers;
      }else{
        throw new HttpException('Not Update', HttpStatus.BAD_REQUEST)
  
      }

    } catch (error) {

      this.logger.error(`manufacturersController/update error is + ${error.message}` )
      throw error;

    }


  }

  @Delete(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {

    try {


      const manufacturer =  this.manufacturersService.getManufacturesById(id);
      if(manufacturer){
        return  this.manufacturersService.remove(id);
      }else{
        throw new HttpException('manufacturer Not Found', HttpStatus.NOT_FOUND)
  
      }

    } catch (error) {

      this.logger.error(`manufacturerController/update error is + ${error.message}` )
      throw error;

    }


  
  }
}

@Controller('top-manufacturers')
export class TopManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  async getTopManufactures(
    @Query() query: GetTopManufacturersDto,
  ): Promise<Manufacturer[]> {
    return this.manufacturersService.getTopManufactures(query);
  }
}
