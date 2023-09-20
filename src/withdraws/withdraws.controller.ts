import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('withdraws')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class WithdrawsController {
  constructor(private readonly withdrawsService: WithdrawsService) {}

  @Post()
  createWithdraw(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawsService.create(createWithdrawDto);
  }

  @Get()
  async withdraws(@Query() query: GetWithdrawsDto): Promise<WithdrawPaginator> {
    return this.withdrawsService.getWithdraws(query);
  }

  @Get(':id')
  withdraw(@Param('id') id: string) {
    return this.withdrawsService.findOne(id);
  }
  @Post(':id/approve')
  approveWithdraw(
    @Param('id') id: string,
    @Body() updateWithdrawDto: ApproveWithdrawDto,
  ) {
    return this.withdrawsService.update(id, updateWithdrawDto);
  }

  @Delete(':id')
  deleteWithdraw(@Param('id') id: string) {
    return this.withdrawsService.remove(id);
  }
}
