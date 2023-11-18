
import {HttpException,HttpStatus,Injectable,Logger,Req, HttpServer } from '@nestjs/common';
// import * as bcrypt from '@types/bcrypt'; 
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {UsersService} from '../users/users.service';
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
import {CommonHelper} from 'src/helper/commonHelper';
import {MailService} from 'src/mail/mail.service';
import {ShopsService} from 'src/shops/shops.service';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {User} from 'src/users/entities/user.entity';
import {jwtConstants} from './gurd/constants';
// import { TransformInterceptor } from 'src/utils/Response.Interceptor';
// const users = plainToClass(User, usersJson);
import env from '../config/env';
import axios from 'axios';
@Injectable()
// @UseInterceptors(TransformInterceptor)
export class AuthService {
  // private users: User[] = users;
  private readonly _commonHelper = new CommonHelper()
  private readonly logger = new Logger();
  constructor(
    // @InjectModel('User') private _user: Model<User>, 
    private usersService: UsersService,
    private jwtService: JwtService,
    // private readonly httpService: HttpServer,
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


  async me(@Req() req): Promise<any> {
    // const id: string = "this is test id"
    // console.log(req?.user);
    try {
      const user = await this.usersService.getUser(req?.user?.id);
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


  async sendOtpCode(otpInput: OtpDto, user:any): Promise<OtpResponse> {
    
    const { otp } = env();
    try {
      const otpCode = this.generateOTP();
      const contactNumber = otpInput.phone_number.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      const data : any = {
        "senderId" : otp.OTP_SenderID,
        "is_Unicode" :  false,
        "is_Flash" :  false,
        "groupId" :  "",
        "message" : otpCode,
        "mobileNumbers" : contactNumber,
        "apiKey" : otp.OTP_ApiKey,
        "clientId" : otp.OTP_ClientId
      }
      
      const response = await axios.post(otp.OTP_URL, data);
      // return response.data;


      let customer = await this.usersService.findById(user.id);

      customer.profile.otp = otpCode.toString();;
      customer.profile.contact = contactNumber;
      await this.usersService.updateWithOtp(user.id, customer)

      const resMes = response.data.Data[0]
      // return response.data;
      return {
        message: resMes.MessageErrorDescription,
        success: true,
        id: resMes.MessageId,
        provider: 'Cloud',
        phone_number: resMes.MobileNumber,
        is_contact_exist: true,
      };

    } catch (err) {
      throw err;
    }
   
  }

   async verifyOtpCode(verifyOtpInput: VerifyOtpDto, user: any): Promise<any> {
   
    try { 
        const usr = await this.usersService.findById(user.id)

        if(usr.profile.otp === verifyOtpInput.code){
            usr.number_verified_at = true
            await this.usersService.updatePhoneNumber(user.id, usr)
        }else{
          throw new HttpException('OTP not correct', HttpStatus.CONFLICT)
        }
            
        return {
          ...usr,
          message: 'success',
          success: true,
        };
      
    } catch (error) {
      // return {
      //   // ...usr,
      //   message: error.message,
      //   success: false,
      // };
      throw error
    }
   
    
  }


  // Generate a random number between 100000 and 999999
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  

}
