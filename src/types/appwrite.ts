import { Models } from 'appwrite';

export type IUser = Models.Document & {
	email: string;
	name: string;
	avatar: string | null;
	accountId: string;
};

export type INewUser = {
	accountId: string;
	email: string;
	name: string;
	avatar?: string;
};

export type INewAccount = {
	email: string;
	password: string;
	username: string;
};

export type ISignInAccount = {
	email: string;
	password: string;
};
