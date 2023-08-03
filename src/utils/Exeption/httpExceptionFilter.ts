import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
 
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