import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  HttpException,
  Req,
  UploadedFiles,
  UseInterceptors,
  Param,
  Res,
  Put,
} from '@nestjs/common';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNoteFormDTO, GetNotesDTO, GetPatientNotesDTO } from './note.dto';
import { NoteService } from './note.service';
import { AuthGuard } from '../auth/auth.guard';
import { IUserData } from 'src/user/user.interfaces';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { ICreateNote, IUpdateNote } from './note.inteface';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(
    private userService: UserService,
    private noteService: NoteService,
  ) {}

  @Get('patient')
  @UseGuards(AuthGuard)
  async getPatientNotes(
    @Body() { userData: { user_id } }: { userData: IUserData },

    @Query() { tags, orderField, orderType, patient_id }: GetPatientNotesDTO,
  ) {
    const check = await this.userService.checkIfHasPermission(
      user_id,
      patient_id,
    );
    if (!check) throw new HttpException('No permission', 400);
    const user = await this.userService.getUserById(patient_id);
    return await this.noteService.getNotes(
      user,
      tags?.split(';') || [],
      orderField,
      +orderType,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getNotes(
    @Query() { tags, orderField, orderType }: GetNotesDTO,
    @Body() { userData: { user_id } }: { userData: IUserData },
  ) {
    const user = await this.userService.getUser(user_id);
    return await this.noteService.getNotes(
      user,
      tags?.split(';') || [],
      orderField,
      +orderType,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(AnyFilesInterceptor())
  async createNote(
    @Req() req: Request,
    @Body()
    body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);

    if (req.is('application/json')) {
      const {
        userData: { user_id },
        ...data
      } = body;
      if (!body.fields.length) throw new HttpException('Bad Request', 404);
      if (data.userId) {
        const check = await this.userService.checkIfHasPermission(
          req.cookies.userId,
          data.userId,
        );
        if (!check) throw new HttpException('Not Allowed', 400);
      }
      console.log(data.userId);

      const user = data.userId
        ? await this.userService.getUserById(data.userId)
        : await this.userService.getUser(user_id);
      return await this.noteService.createNote({
        user,
        ...data,
      } as ICreateNote);
    } else {
      const { name, form, userId } = body;
      const tags = body.tags.split(';');
      const created_at = body.created_at;
      delete body.form;
      delete body.name;
      delete body.created_at;
      delete body.tags;
      if (userId) {
        const check = await this.userService.checkIfHasPermission(
          req.cookies.userId,
          userId,
        );
        if (!check) throw new HttpException('Not Allowed', 400);
      }

      const user = userId
        ? await this.userService.getUserById(userId)
        : await this.userService.getUser(req.cookies.userId);
      const valueFields = Object.keys(body).map((e) => ({
        label: e,
        value: body[e],
      }));

      const fileFields = files.map((e) => ({
        label: e.fieldname,
        value: 'note/image/' + e.filename,
      }));
      const fields = [...valueFields, ...fileFields];

      return await this.noteService.createNote({
        user,
        form,
        fields,
        name,
        tags,
        created_at,
      });
    }
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(AnyFilesInterceptor())
  async updateNote(
    @Req() req: Request,
    @Body()
    body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);

    if (req.is('application/json')) {
      const {
        userData: { user_id },
        created_at,
        ...data
      } = body;
      if (!body.fields.length) throw new HttpException('Bad Request', 404);
      if (data.userId) {
        const check = await this.userService.checkIfHasPermission(
          req.cookies.userId,
          data.userId,
        );
        if (!check) throw new HttpException('Not Allowed', 400);
      }

      const user = data.userId
        ? await this.userService.getUserById(data.userId)
        : await this.userService.getUser(user_id);
      return await this.noteService.updateNote({
        created_at: created_at as string,
        user,
        ...data,
      } as IUpdateNote);
    } else {
      const { id, name, form, userId } = body;
      const tags = body.tags.split(';');
      const created_at = body.created_at;
      delete body.id;
      delete body.form;
      delete body.name;
      delete body.created_at;
      delete body.tags;
      if (userId) {
        const check = await this.userService.checkIfHasPermission(
          req.cookies.userId,
          userId,
        );
        if (!check) throw new HttpException('Not Allowed', 400);
      }

      const user = userId
        ? await this.userService.getUserById(userId)
        : await this.userService.getUser(req.cookies.userId);
      const valueFields = Object.keys(body).map((e) => ({
        label: e,
        value: body[e],
      }));

      const fileFields = files.map((e) => ({
        label: e.fieldname,
        value: 'note/image/' + e.filename,
      }));
      const fields = [...valueFields, ...fileFields];

      return await this.noteService.updateNote({
        id,
        form,
        fields,
        name,
        tags,
        created_at,
        user,
      });
    }
  }

  @Get('/form')
  async getForms() {
    return await this.noteService.getForms();
  }

  @Post('/form')
  async createForm(@Body() body: CreateNoteFormDTO) {
    return await this.noteService.createForm(body);
  }

  @ApiParam({
    name: 'image',
    example: '/note/image/e1d96a72-f2e0-453b-9839-a885d327c52e.png',
  })
  @Get('/image/:image')
  async getImage(@Param('image') image, @Res() res: Response) {
    return res.sendFile(image, { root: `${process.cwd()}/uploads/note/` });
  }
}
