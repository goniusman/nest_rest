import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
 
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