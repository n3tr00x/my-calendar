import { Models } from 'appwrite';
import { z } from 'zod';

import { NewEventSchema } from '@/schemas/NewEventSchema';

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

export type NewEvent = z.infer<typeof NewEventSchema> & { user: string | undefined };

export type Event = Models.Document & {
	accountId: string;
	user: IUser;
	title: string;
	description: string;
	isAllDay: boolean;
	location: string;
	repeat: 'no-repeat' | 'daily' | 'weekly' | 'monthly';
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
};
