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
  Req,
  UseGuards,
} from '@nestjs/common';
import {GetUsersDto} from 'src/users/dto/get-users.dto';
// import { UsersService } from 'src/users/users.service';
import {CreateStoreNoticeDto} from './dto/create-store-notice.dto';
import {GetStoreNoticesDto} from './dto/get-store-notices.dto';
import {UpdateStoreNoticeDto} from './dto/update-store-notice.dto';
import {StoreNoticesService} from './store-notices.service';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { cli } from 'winston/lib/winston/config';


@Controller('store-notices')
export class StoreNoticesController {

  private readonly logger = new Logger();
  constructor(
    private readonly storeNoticesService: StoreNoticesService,
  ) {}

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createStoreNotice(@Body() createStoreNoticeDto: CreateStoreNoticeDto, @Req() req: any) {

    
    try {
       createStoreNoticeDto.created_by = req.user.id
      return this.storeNoticesService.create(createStoreNoticeDto);
    } catch (error) {

      this.logger.error(`StoreNotice/createStoreNotice failed: ${error}`)
      throw error
    }


  }

  @Get()
  getStoreNotices(@Query() query: GetStoreNoticesDto) {

  console.log(query)
    try {
      
      return this.storeNoticesService.getStoreNotices(query);
    } catch (error) {

      this.logger.error(`StoreNotice/getStoreNotices failed: ${error}`)
      throw error
    }

  }

  @Get('getUsersToNotify')
  getAllUsers(@Query() query: GetUsersDto) {
    return this.storeNoticesService.getUsersNotify(query);
  }

  @Get(':param')
  getStoreNotice(
    @Param('param') param: string,
    @Query('language') language: string,
  ) {

    try {
          return this.storeNoticesService.getStoreNotice(param, language);

    } catch (error) {

      this.logger.error(`StoreNotice/getStoreNotices failed: ${error}`)
      throw error
    }

  }
  @Put(':id')
  update(
    @Param('id') id: any,
    @Body() updateStoreNoticeDto: UpdateStoreNoticeDto,
  ) {
    try {
          return this.storeNoticesService.update(id, updateStoreNoticeDto);

    } catch (error) {

      this.logger.error(`StoreNotice/update failed: ${error}`)
      throw error
    }

  }

  @Delete(':id')
  deleteStoreNotice(@Param('id') id: any) {

    try {
      
      return this.storeNoticesService.remove(id);
    } catch (error) {

      this.logger.error(`StoreNotice/deleteStoreNotice failed: ${error}`)
      throw error
    }

    
  }
}
