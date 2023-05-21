
import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

import toStream  from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        
    try {
      return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error){
              return reject(error); 
            } 
            resolve(result);
          });
        
          toStream(file.buffer).pipe(upload);
          
        });

    } catch (error) {
      return error
    }

    

  }



  async uploadImageToCloudinary(file: Express.Multer.File) {

    try {
      return await this.uploadImage(file).catch((err) => {
      throw new BadRequestException(err.message);
    });
    } catch (error) {
      console.log(error.message);
    }
    
  }



  async deleteCloudinaryImage(public_id: any, signature:any){
    try {
      return  await v2.uploader.destroy(public_id, signature).catch(err=>{
      throw new BadRequestException(err.message);
    });
    } catch (error) {
      console.log(error.message);
    }
    
  } 

}