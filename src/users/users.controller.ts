import {
  Controller,
  Request,
  UseGuards,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUsersDto } from './dto/get-users.dto';
import {ApiConsumes, ApiOkResponse} from '@nestjs/swagger';
// import { CreateUserDto } from '../dto/create-user.dto';
import {  User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// import { LocalAuthGuard } from '../auth/local/local.auth.guard';
// import { AuthenticatedGuard } from '../auth/local/authenticated.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import { IUser } from '../interface/user.interface';


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // @ApiOkResponse({
  //   description: 'The user records',
  //   type: User,
  //   isArray: true
  // })

  @Post()
  @ApiConsumes('multipart/form-data')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User>  {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post("/login")
  // login(@Body() req): any {
  //   console.log(req);
  //   return {User: req.user,
  //           msg: 'User logged in'};
  // }


  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' }
  }



  @Get()
  getAllUsers(@Query() query: any) {
    return this.usersService.getUsers(query);
  }

  // @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
 
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('unblock-user')
  activeUser(@Body('id') id: string) {
    return this.usersService.activeUser(id);
  }

  @Post('block-user')
  banUser(@Body('id') id: string) {
    return this.usersService.banUser(id);
  }

  @Post('make-admin') 
  makeAdmin(@Req() req: Request , @Body('user_id') id: string) {
    return this.usersService.makeAdmin(id);
  }

  // @Post('profile-picture')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // profilePicture(@UploadedFile() file: Express.Multer.File):any {
  // //  console.log(file);
  //     return this.usersService.profilePicture(file);
  // }

}





@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    console.log(createProfileDto);
  }

  @Put(':id')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
  }

  // @Delete(':id')
  // deleteProfile(@Param('id') id: number) {
  //   return this.usersService.remove(id);
  // }
}
