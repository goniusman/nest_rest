import { Controller, Get, Post, Body, HttpCode, HttpStatus, Param, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// import { AuthGuard } from './auth.guard';

import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  RegisterDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import {CreateUserDto} from 'src/users/dto/create-user.dto';

import { HasRoles } from './has-roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { LocalAuthGuard } from './gurd/local-auth.guard'
import { JwtAuthGuard } from './gurd/jwt-auth.guard'
import {IGetUserAuthInfoRequest} from 'src/helper/typeDefinition';
import { query } from 'express';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


    @Post('register')
    createAccount(@Body() registerDto: CreateUserDto) {
      return this.authService.register(registerDto);
    }

 
    // @UseGuards(LocalAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // async login(@Request() req) : Promise<any>{
    //     return await this.authService.login(req.body);
    // }

    // @UseGuards(AuthGuard)
    // @Post('token')
    // async token(@Request() req) {
    //     return this.authService.token(req.user);
    // }
    
    @HasRoles(Role.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('getallusers')
    async getallusers(@Request() req) {
        return this.authService.getAllUsr();
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('me/:id')
    // me(@Param('id') id?: string) { 
    //   return this.authService.me(id);
    // }
 
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    changePassword(@Req() req: IGetUserAuthInfoRequest, @Body() changePasswordDto: ChangePasswordDto) {
      // const email = req;
      return this.authService.changePassword(req?.user?.email, changePasswordDto);
    }

    // @HasRoles(Role.SUPER_ADMIN)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Get('admin')
    // onlyAdmin(@Request() req) {
    //   return req.user;
    // }
  
    // @HasRoles(Role.CUSTOMER)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Get('user')
    // onlyUser(@Request() req) {
    //   return req.user;
    // }



  
  @Post('token')
  // @Post('login') 
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('social-login-token')
  socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.socialLogin(socialLoginDto);
  }
  @Post('otp-login')
  otpLogin(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.otpLogin(otpLoginDto);
  }
  @Post('send-otp-code')
  sendOtpCode(@Body() otpDto: OtpDto) {
    return this.authService.sendOtpCode(otpDto);
  }
  @Post('verify-otp-code')
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpCode(verifyOtpDto);
  }
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  
  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }
  @Post('verify-forget-password-token')
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }

 
  @Post('add-points')
  addWalletPoints(@Body() addPointsDto: any) {
    return this.authService.me(); 
  }
  @Post('contact-us')
  contactUs(@Body() addPointsDto: any) {
    return {
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
    };
  }


  @Get('me/:id')
  me(@Param('id') id: string) {
    return this.authService.me(id);
  }


}
