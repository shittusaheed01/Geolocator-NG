import { Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  apiKey: string;
}

export interface SignUpRequestBody {
	name: string;
	email: string;
	password: string;
}

export interface LoginRequestBody {
	email: string;
	password: string;
}