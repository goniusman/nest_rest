import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {Role} from 'src/auth/gurd/role.enum';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {RolesGuard} from 'src/auth/gurd/roles.guard';

@Controller('contactus')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Post()
  create(@Body() createContactusDto: CreateContactusDto) {
    return this.contactusService.create(createContactusDto);
  }

  @Get()
  findAll() {
    return this.contactusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactusService.findOne(id);
  }
   
  @Put(':id')
  @HasRoles(Role.CUSTOMER, Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateContactusDto: UpdateContactusDto) {
    // console.log(req);
    return this.contactusService.update(id, updateContactusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactusService.remove(id);
  }

  
}
