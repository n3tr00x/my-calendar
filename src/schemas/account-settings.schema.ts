import { z } from 'zod';

export const updateUsernameSchema = z.object({
	username: z.string().min(1),
});

export const updateEmailSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export const updatePasswordSchema = z
	.object({
		oldPassword: z.string().min(1),
		password: z.string().min(1),
		repeatPassword: z.string().min(1),
	})
	.refine(data => data.password === data.repeatPassword, {
		message: 'Passwords do not match',
		path: ['repeatPassword'],
	});
