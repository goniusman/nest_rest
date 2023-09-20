import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { RefundsService } from './refunds.service';

@Controller('refunds')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefundsController {

  private readonly logger = new Logger();
  
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  create(@Body() createRefundDto: CreateRefundDto, @Req() req: any) {
    try {

      return this.refundsService.create(createRefundDto, req?.user);
       } catch (error) {
         this.logger.error(`refunds/create failed: ${error}`)
         throw error
       }

  }

  @Get()
  async findAll(@Query('user_id') userid) {
    try {

         return await this.refundsService.findAll(userid);
       } catch (error) {
         this.logger.error(`refunds/findall failed: ${error}`)
         throw error
       }
 
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    try {

      return this.refundsService.findOne(id);
       } catch (error) {
         this.logger.error(`refunds/findone failed: ${error}`)
         throw error
       }

  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateRefundDto: UpdateRefundDto) {
    try {

    return this.refundsService.update(id, updateRefundDto);
       } catch (error) {
         this.logger.error(`refunds/update failed: ${error}`)
         throw error
       }

  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    try {

    return this.refundsService.remove(id);
       } catch (error) {
         this.logger.error(`refunds/remove failed: ${error}`)
         throw error
       }

  }

  
}
