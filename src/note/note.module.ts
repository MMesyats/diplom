import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema, NoteForm, NoteFormSchema } from './note.schema';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName } from 'src/utils/utils.file';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: NoteForm.name, schema: NoteFormSchema },
    ]),
    MulterModule.register({
      fileFilter: (_, file, cb) => {
        cb(null, file.mimetype.includes('image'));
      },
      storage: diskStorage({
        destination: `./uploads/note`,
        filename: generateFileName,
      }),
    }),
  ],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
