import { HttpException, HttpStatus, NotFoundException, ExceptionFilter, Catch, ArgumentsHost} from '@nestjs/common';
import { Request, Response } from 'express';


// class PostNotFoundException extends HttpException {
//   constructor(postId: number) {
//     super(`Post with id ${postId} not found`, HttpStatus.NOT_FOUND);
//   }
// }





////////////NestJS has a set of exceptions that extend the  HttpException
export class PostNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Post with id ${postId} not found`);
  }
}





 
@Catch(HttpException )
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    // const message = exception.getMessage();
//  
    // response
    //   .status(status)
    //   .json({
    //     // message,
    //     statusCode: status,
    //     time: new Date().toISOString(),
    //   });

    response
    .status(status)
    .json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });


  }
}


@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}






