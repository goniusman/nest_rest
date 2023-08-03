import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {

  private readonly logger = new Logger();
  
  constructor(private mailerService: MailerService) { }


  async sendUserConfirmation(user: any, token: any) {
    const url = `/auth/confirmregister?token=${token}`;

    try {
      return await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: { // filling curly brackets with content
          name: user.name, 
          url,
        },
      });
      // console.log(statuss);
    } catch (error) {

      console.log(error.message);
      console.log('sending mail....')
      this.logger.error(`mailService/sendUserConfirmation/ error message is -- ${error.message}`);
      throw new HttpException("Mail Sending Failed", HttpStatus.CONFLICT);


    }

  }


  async sendUserGreetings(user: User) {
   
    try {
      return await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Thanks for registration',
        template: './greetings', // `.hbs` extension is appended automatically
        context: { // filling curly brackets with content
          name: user.name
        },
      });

    } catch (error) {

      console.log(error.message);

      this.logger.error(`mailService/sendUserGreetings/ error message is -- ${error.message}`);
      throw new HttpException("Mail Sending Failed", HttpStatus.CONFLICT);


    }
  }



}
