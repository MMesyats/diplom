import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName } from '../utils/utils.file';

export const Images = (filesName: string, itemCount: number, path: string) => {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(filesName, itemCount, {
        fileFilter: (_, file, cb) => {
          cb(null, file.mimetype.includes('image'));
        },
        storage: diskStorage({
          destination: `./uploads${path}`,
          filename: generateFileName,
        }),
      }),
    ),
  );
};
export const Image = (filesName: string, path: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(filesName, {
        fileFilter: (_, file, cb) => {
          console.log(file.mimetype.includes('image'));

          cb(null, file.mimetype.includes('image'));
        },
        storage: diskStorage({
          destination: `./uploads${path}`,
          filename: generateFileName,
        }),
      }),
    ),
  );
};
