import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const generateFileName = (
  _,
  file: Express.Multer.File,
  cb: (agr0: Error, arg1: string) => void,
) => {
  cb(null, `${uuid()}${extname(file.originalname)}`);
};
