import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryMiddleware {
  getMiddleware() {
    return cloudinary.v2.uploader.upload;
  }
}