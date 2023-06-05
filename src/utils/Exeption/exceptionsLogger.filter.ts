
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
 
@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Custome Exception thrown ' , exception);
    super.catch(exception, host);
  }
}


/// for specific api route 
// @UseFilters(ExceptionsLoggerFilter)