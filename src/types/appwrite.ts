import { Models } from 'appwrite';
import { z } from 'zod';

import {
	RequestPasswordResetSchema,
	ResetPasswordSchema,
	SignInValidation,
	SignUpValidation,
} from '@/schemas/auth.schema';
import { NewEventSchema } from '@/schemas/new-event.schema';

export type User = Models.Document & {
	email: string;
	name: string;
	avatar: string | null;
	avatarId: string | null;
	accountId: string;
};

export type NewUser = {
	accountId: string;
	email: string;
	name: string;
};

export type NewAccount = {
	email: string;
	password: string;
	username: string;
};

export type SignInAccount = {
	email: string;
	password: string;
};

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

export type ResetPasswordParams = {
	userId: string;
	secret: string;
	password: string;
};

export type NewEventFormData = z.infer<typeof NewEventSchema>;

export type SignUpFormData = z.infer<typeof SignUpValidation>;

export type SignInFormData = z.infer<typeof SignInValidation>;

export type RequestPasswordResetFormData = z.infer<typeof RequestPasswordResetSchema>;

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
