import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

export type bloodType =
  | '0(I)+'
  | 'A(II)+'
  | 'B(II)+'
  | 'AB(IV)+'
  | '0(I)-'
  | 'A(II)-'
  | 'B(II)-'
  | 'AB(IV)-';

export const bloodTypesArray = [
  '0(I)+',
  'A(II)+',
  'B(III)+',
  'AB(IV)+',
  '0(I)-',
  'A(II)-',
  'B(III)-',
  'AB(IV)-',
];

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  birthdayDate: Date;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  city: string;

  @Prop({
    required: true,
    enum: bloodTypesArray,
  })
  bloodType: bloodType;

  @Prop({ required: true, unique: true })
  firebaseId: string;

  @Prop()
  isDoctor: boolean;

  @Prop({ type: [{ type: mongooseSchema.Types.ObjectId, ref: 'User' }] })
  patients: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
