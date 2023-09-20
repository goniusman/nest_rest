import {
  Body,
  Controller,
  Delete,
  Get,
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
import {CreateShippingDto} from './dto/create-shipping.dto';
import {GetShippingsDto} from './dto/get-shippings.dto';
import {UpdateShippingDto} from './dto/update-shipping.dto';
import {ShippingsService} from './shippings.service';
@Controller('shippings')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShippingsController {
  
  private readonly logger = new Logger();
  
  constructor(private readonly shippingsService: ShippingsService) {}

  @Post()
  create(@Body() createShippingDto: CreateShippingDto) {
    
    try {

     return this.shippingsService.create(createShippingDto);
    } catch (error) {
      this.logger.error(`shippings/findAll failed: ${error}`)
      throw error
    }
  }

  @Get()
  findAll(@Query() query: GetShippingsDto) {

    try {
      return this.shippingsService.getShippings(query);

    } catch (error) {
      this.logger.error(`shippings/findAll failed: ${error}`)
      throw error
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

    try {
       return this.shippingsService.findOne(id);

    } catch (error) {
      this.logger.error(`shippings/find failed: ${error}`)
      throw error
    }
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {

     try {
     return this.shippingsService.update(id, updateShippingDto);

    } catch (error) {
      this.logger.error(`shippings/update failed: ${error}`)
      throw error
    }}


  @Delete(':id')
  remove(@Param('id') id: string) {
    try {

      return this.shippingsService.remove(id);
    } catch (error) {
      this.logger.error(`shippings/remove failed: ${error}`)
      throw error
    }
   
  }
  
}
