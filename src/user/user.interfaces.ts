export interface IUserData {
  name: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: true;
  phone_number: string;
  firebase: {
    identities: { 'google.com': any[]; phone: any[]; email: any[] };
    sign_in_provider: string;
  };
  uid: string;
}

export interface IGetUser {
  userData: IUserData;
}
