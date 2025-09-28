import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {ApproveWithdrawDto} from './dto/approve-withdraw.dto';
import {CreateWithdrawDto} from './dto/create-withdraw.dto';
import {GetWithdrawsDto,WithdrawPaginator} from './dto/get-withdraw.dto';
import {WithdrawsService} from './withdraws.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Withdraws")
@Controller('withdraws')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class WithdrawsController {

  private readonly logger = new Logger(); 

  constructor(private readonly withdrawsService: WithdrawsService) {}

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createWithdraw(@Body() createWithdrawDto: CreateWithdrawDto) {
    try {
      
      return this.withdrawsService.create(createWithdrawDto);
    // }else{
    //   throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
  
    // }

    } catch (error) {
      this.logger.error(`Withdraws/create failed: ${error} user is ${createWithdrawDto?.shop_id}`)
      throw error
    }
 
  }

  @Get()
  async withdraws(@Query() query: GetWithdrawsDto): Promise<WithdrawPaginator> {
    try {
      
      return this.withdrawsService.getWithdraws(query);

    } catch (error) {
      this.logger.error(`Withdraws/withdraws failed: ${error} user is ${query.shop_id}`)
      throw error
    }

  }

  @Get(':id')
  withdraw(@Param('id') id: string) {
    try {
      
      return this.withdrawsService.findOne(id);

    } catch (error) {
      this.logger.error(`Withdraws/withdraw failed: ${error} user is ${id}`)
      throw error
    }

  }

  @Post('approve-withdraw')
  approveWithdraw(
    @Param('id') id: string,
    @Body() updateWithdrawDto: ApproveWithdrawDto,
  ) {
// console.log(id);
// console.log(updateWithdrawDto);
    try {
      
      return this.withdrawsService.update(updateWithdrawDto.id, updateWithdrawDto);

    } catch (error) {
      this.logger.error(`Withdraws/approveWithdraw failed: ${error} user is ${id}`)
      throw error
    }

  }

  @Delete(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteWithdraw(@Param('id') id: string) {
    try {
      
      return this.withdrawsService.remove(id);

    } catch (error) {
      this.logger.error(`Withdraws/deleteWithdraw failed: ${error} user is ${id}`)
      throw error
    }

  }
}
