import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';

export type NoteDocument = Note & Document;
export type NoteFormDocument = NoteForm & Document;

@Schema()
export class NoteForm {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Object] })
  schema: {
    label: string;
    type: 'number' | 'text' | 'select' | 'image';
    options?: string[];
  };
}

@Schema()
export class Note {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [Object] })
  fields: {
    label: string;
    value: string | number;
  }[];

  @Prop({
    required: true,
    type: mongooseSchema.Types.ObjectId,
    ref: 'NoteForm',
  })
  form: string;

  @Prop()
  created_at: Date;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}
export const NoteFormSchema = SchemaFactory.createForClass(NoteForm);
export const NoteSchema = SchemaFactory.createForClass(Note);
