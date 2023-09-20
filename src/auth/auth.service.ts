
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// import * as bcrypt from '@types/bcrypt'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';
import {
  AuthResponse,
  CoreResponse,
  ForgetPasswordDto,
  OtpDto,
  OtpLoginDto,
  OtpResponse,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto
} from './dto/create-auth.dto';
// import { User } from 'src/users/entities/user.entity';
import usersJson from '@db/users.json';
import { CommonHelper } from 'src/helper/commonHelper';
import { MailService } from 'src/mail/mail.service';
import { ShopsService } from 'src/shops/shops.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { jwtConstants } from './gurd/constants';
// import { TransformInterceptor } from 'src/utils/Response.Interceptor';
const users = plainToClass(User, usersJson);

@Injectable()
// @UseInterceptors(TransformInterceptor)
export class AuthService {
  private users: User[] = users;
  private readonly _commonHelper = new CommonHelper()
  private readonly logger = new Logger();
  constructor(
    // @InjectModel('User') private _user: Model<User>, 
    private usersService: UsersService,
    private jwtService: JwtService,
    private shopService: ShopsService,
    private mailService: MailService
  ) { }



  async register(createUserInput: CreateUserDto): Promise<any> {

    try {

      if (createUserInput.email != undefined) {

        const existuser = await this.usersService.findByEmail(createUserInput.email)

        if (existuser == null) {

          const createdUser = await this.usersService.create(createUserInput);

          if (createdUser._id) {
            return createdUser;
          } else {
            throw new HttpException('User Created Faild!', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

      } else {
        throw new HttpException('Email Not Submited!', HttpStatus.BAD_REQUEST)
      }

    } catch (err) {

      this.logger.error(`auth/register/ error message is -- ${err.message}`);
      throw err
    }


  }

  async confirmRegister(id) {
    try {
      const updatedUser = await this.usersService.updateEmailVerified(id);
      if (updatedUser._id) {
        return updatedUser;
      } else {
        throw new HttpException('Update User Faild!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      this.logger.error(`authservice/confirmRegister error is ${error.message}`)
      throw error
    }


  }

  async token(user: any) {
    return await this.jwtService.sign(user)
  }

  async validateUser(email: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      } else {
        return user;
      }

    } catch (err) {
      this.logger.error(`authController/token user login error: ${err.message}`);
      throw err;
    }

  }

  async findByEmail(email: string) {
    return await this.usersService.findByEmail(email)
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      return payload;

    } catch (error) {
      this.logger.error(`authService/verifyToken ${error.message}`)
      return error
    }

  }

  async validatePassword(dbpass: string, password: string): Promise<boolean> {
    const passwordValid = await bcrypt.compare(password, dbpass)

    if (passwordValid) {
      return true;
    } else {
      return false
    }

  }

  async updatePassword(email: string, newPassword: string): Promise<any> {
    return await this.usersService.updatePassword(email, newPassword)
  }


  async me(id: string = "645edc9c9f206888102d1782"): Promise<any> {
    // const id: string = "this is test id"
    try {
      const user = await this.usersService.getUser(id);
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _doc, ...others } = user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, updatedAt, __v, ...result } = _doc

        return result;

      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

    } catch (err) {
      this.logger.error(`authService/me user error: ${err.message}`);
      throw err;
    }

  }

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(forgetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(verifyForgetPasswordTokenInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(resetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    console.log(socialLoginDto);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
      id: ""
    };
  }

  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    console.log(otpLoginDto);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
      id: ""
    };
  }

  async verifyOtpCode(verifyOtpInput: VerifyOtpDto, user: any): Promise<CoreResponse> {
   
    const usr = await this.usersService.findById(user.id)

    usr.profile.contact = verifyOtpInput.phone_number
    await this.usersService.updatePhoneNumber(user.id, usr)

    return {
      ...usr,
      message: 'success',
      success: true,
    };
    
  }

  async sendOtpCode(otpInput: OtpDto, user:any): Promise<OtpResponse> {
    // console.log(otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

 


}
