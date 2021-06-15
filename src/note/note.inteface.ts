import { UserDocument } from 'src/user/user.schema';
export interface ICreateNote {
  name: string;
  fields: {
    label: string;
    value: string | number;
  }[];
  tags: string[];
  form: string;
  created_at: string;
  user: UserDocument;
}

export interface IUpdateNote {
  id: string;
  name: string;
  fields: {
    label: string;
    value: string | number;
  }[];
  tags: string[];
  created_at: string;
  form: string;
  user: UserDocument;
}
