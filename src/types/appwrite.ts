import { Models } from 'appwrite';
import { z } from 'zod';

import { NewEventSchema } from '@/schemas/new-event.schema';

export type User = Models.Document & {
	email: string;
	name: string;
	avatar: string | null;
	avatarId: string | null;
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

export type NewEventForm = z.infer<typeof NewEventSchema>;

export type NewEvent = z.infer<typeof NewEventSchema> & { user?: string; accountId?: string };

export type Event = Models.Document & {
	accountId: string;
	user: User;
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
