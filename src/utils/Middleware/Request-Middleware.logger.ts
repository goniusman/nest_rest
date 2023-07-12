import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      // const statusCode = res.statusCode;
      // if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
      //   this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      // }

      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;
 
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

 
      if (statusCode >= 500) {
        return this.logger.error(message);
      }
 
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }
 
      // return this.logger.error(message);
      return this.logger.log(message);

    });

    next();
  }
}