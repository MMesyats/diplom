import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument, NoteForm, NoteFormDocument } from './note.schema';
import { CreateNoteFormDTO } from './note.dto';
import { UserService } from '../user/user.service';
import { UserDocument } from 'src/user/user.schema';
import { ICreateNote, IUpdateNote } from './note.inteface';

@Injectable()
export class NoteService {
  constructor(
    private userService: UserService,
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(NoteForm.name) private noteFormModel: Model<NoteFormDocument>,
  ) {}

  async getNotes(
    user: UserDocument,
    tags: string[],
    order_field: string,
    order_type: number,
  ) {
    const tagsFilter = tags.length ? { tags: { $in: tags } } : {};
    const sort = {};

    if (order_field && order_type !== undefined && !isNaN(order_type)) {
      Object.defineProperty(sort, order_field, {
        value: order_type,
        enumerable: true,
        configurable: true,
      });
    }

    const notes = await this.noteModel.find(
      {
        user: user.id,
        ...tagsFilter,
      },
      null,
      { sort: sort },
    );
    const noteFormsIds = new Set(notes.map(({ form }) => form.toString()));

    const forms = await this.noteFormModel.find({
      _id: { $in: [...noteFormsIds] },
    });

    return notes.map((note) => {
      return { note, form: forms.find(({ id }) => id == note.form) };
    });
  }

  async getForms() {
    return await this.noteFormModel.find();
  }

  async createForm(data: CreateNoteFormDTO) {
    const noteForm = await this.noteFormModel.create(data);
    return await noteForm.save();
  }

  async createNote({ user, created_at, ...data }: ICreateNote) {
    const note = await this.noteModel.create({
      ...data,
      created_at: created_at || Date.now(),
      user: user.id,
    });
    return await note.save();
  }

  async updateNote({ id, user, created_at, ...data }: IUpdateNote) {
    console.log(data);
    console.log({ _id: id, user: user.id });

    const note = await this.noteModel.updateOne(
      { _id: id, user: user.id },
      { ...data, created_at: new Date(Date.parse(created_at)) },
    );
    return note;
  }
}
