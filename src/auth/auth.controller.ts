/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

// import { AuthGuard } from './auth.guard';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto
} from './dto/create-auth.dto';

import { ApiTags } from '@nestjs/swagger';
import { IGetUserAuthInfoRequest } from 'src/helper/typeDefinition';
import { MailService } from 'src/mail/mail.service';
import { HasRoles } from './gurd/has-roles.decorator';
import { JwtAuthGuard } from './gurd/jwt-auth.guard';
import { Role } from './gurd/role.enum';
import { RolesGuard } from './gurd/roles.guard';
// import { query } from 'express';
// import { ApiConsumes } from '@nestjs/swagger';
// import { TransformInterceptor } from 'src/utils/Response.Interceptor';

@ApiTags("Auth")
@Controller("auth")
// @UseInterceptors(TransformInterceptor)
export class AuthController {

  private readonly logger = new Logger();

  constructor(
    private readonly authService: AuthService,
    private mailService: MailService

  ) { }


  @Post('register')
  // @UseFilters(HttpExceptionFilter)
  async createAccount(@Body() registerDto: CreateUserDto): Promise<any> {

    try {

      if (registerDto?.email != undefined) {

        const existuser = await this.authService.findByEmail(registerDto.email)

        if (existuser == null) {

          const createdUser = await this.authService.register(registerDto);

          if (createdUser._id) {

            const payload = {
              id: createdUser._id,
              name: createdUser.name,
              email: createdUser.email,
              // password: createdUser.password,
              permissions: createdUser.permissions,
            };
            const token = await this.authService.token(payload)

            if (token) {
              const sendMail = await this.mailService.sendUserConfirmation(payload, token);

              if (sendMail != null) {
                return {
                  ...payload,
                  token,
                  message: "Please Check your email addressess"
                }
              } else {

                throw new HttpException('Email Send Faild!', HttpStatus.CONFLICT);
              }
            } else {

              throw new HttpException('Token Not Generated!', HttpStatus.CONFLICT);
            }
          } else {

            throw new HttpException('User Created Faild!', HttpStatus.CONFLICT);
          }

        } else {

          throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
        }

      } else {

        throw new HttpException('Email Should Not Be Empty!', HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      // response.status = 400
      this.logger.error(`authController/register/ error message is -- ${error.message} user ` );

      // throw new HttpException({
      //   // status: HttpStatus.FORBIDDEN,
      //   error: error,
      // }, HttpStatus.BAD_GATEWAY, {
      //   cause: error
      // });

      throw error

    }

  }


  @Get('confirmregister')
  async confirmRegister(@Body() body, @Query() query) {

    try {
      const { token } = query;

      const user = await this.authService.verifyToken(token)
      if (user) {
        const existuser = await this.authService.findByEmail(user.email)
        if (existuser != null) {

          const updateEmailVerify = await this.authService.confirmRegister(user.id)

          if (updateEmailVerify != null) {
            const sendMail = await this.mailService.sendUserGreetings(user);
            if (sendMail.accepted.length > 0) {
              return {
                ...user,
                message: "Email Verified Successfully"
              }
            } else {

              throw new HttpException('Email Send Faild!', HttpStatus.CONFLICT);
            }
          } else {
            throw new HttpException('Email Not Verified yet!', HttpStatus.CONFLICT);
          }

        } else {
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }

      } else {
        throw new HttpException('Token Not Valid', HttpStatus.NOT_FOUND);
      }


    } catch (error) {
      this.logger.error(`authController/confirmRegister error is ${error.message}`)
      throw error;
    }

  }


  @Post('token')
  // @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res): Promise<any> {

    try {

      if (loginDto.email && loginDto.password) {

        const user = await this.authService.findByEmail(loginDto.email)

        if (user) {

          const ValidePassword = await this.authService.validatePassword(user?.password, loginDto.password);

          if (ValidePassword) {

            const id = user?._id.toString();
            const permissions = user?.permissions
            const payload = {
              id,
              name: user.name,
              email: user.email,
              permissions
            };

            return res.status(200).send({
              id,
              permissions,
              token: await this.authService.token(payload),
            });

          } else {

            throw new HttpException('Password Not Valid', HttpStatus.BAD_REQUEST)

          }

        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
      } else {
        throw new HttpException('Email and password shuld not be empty!', HttpStatus.NOT_FOUND)
      }

    } catch (err) {
      this.logger.error(`authController/token user login error: ${err.message}`);
      throw err;
    }

  }


  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async me(@Param('id') id?: any) {

    try {
      const user = await this.authService.me(id);
      if (user) {
        return user;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

    } catch (err) {
      this.logger.error(`authController/me user login error: ${err.message}`);
      throw err;
    }


  }


  @HasRoles(Role.SUPER_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin')
  onlyAdmin(@Request() req) {
    return req.user;
  }

  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('user')
  onlyUser(@Request() req) {
    return req.user;
  }


  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: IGetUserAuthInfoRequest, @Body() changePasswordDto: ChangePasswordDto) {

    const email = req?.user?.email;

    try {
      if (changePasswordDto.newPassword && changePasswordDto.oldPassword) {

        const validateUser = await this.authService.validateUser(email);
        if (validateUser) {

          const validatePassword = await this.authService.validatePassword(validateUser.password, changePasswordDto.oldPassword)

          if (validatePassword) {

            const updatePassword = await this.authService.updatePassword(validateUser.email, changePasswordDto.newPassword)

            if (updatePassword) {
              return {
                success: true,
                message: 'Password changed successful!',
              };
            } else {
              throw new HttpException('Password Not Changed!', HttpStatus.CONFLICT)

            }

          } else {
            throw new HttpException('Password Not Match!', HttpStatus.BAD_REQUEST)
          }
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

      } else {
        throw new HttpException('Password Field Shuld not be empty!', HttpStatus.BAD_REQUEST)

      }
    } catch (err) {
      this.logger.error(`authController/changePassword error: ${err.message}`);
      throw err;
    }



  }

  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }


  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
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
  @HasRoles(Role.SUPER_ADMIN, Role.CUSTOMER, Role.STORE_OWNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  sendOtpCode(@Body() otpDto: OtpDto, @Req() req) {
    return this.authService.sendOtpCode(otpDto, req?.user);
  }


  @Post('verify-otp-code')
  @HasRoles(Role.SUPER_ADMIN, Role.CUSTOMER, Role.STORE_OWNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto, @Req() req) {
    return this.authService.verifyOtpCode(verifyOtpDto, req?.user);
  }


  @Post('verify-forget-password-token')
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }





}
