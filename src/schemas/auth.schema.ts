import { z } from 'zod';

export const SignInValidation = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(256),
});

export const SignUpValidation = z
	.object({
		username: z
			.string()
			.min(3, { message: 'The username must contain at least 3 character(s)' })
			.max(128),
		email: z.string().email(),
		password: z
			.string()
			.min(8, { message: 'The password must contain at least 8 character(s)' })
			.max(256),
		confirmPassword: z
			.string()
			.min(8, { message: 'The password must contain at least 8 character(s)' })
			.max(256),
	})
	.refine(data => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords does not match.',
	});

export const RequestPasswordResetSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }),
});

export const ResetPasswordSchema = z
	.object({
		password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
