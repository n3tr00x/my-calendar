import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
	Button,
	Fieldset,
	Input,
	Link as ChakraLink,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { z } from 'zod';

import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import { useCreateUserAccount, useSignInAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

const SignUpValidation = z
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

export function SignUpPage() {
	console.log('<SignUpPage /> render.');

	const navigate = useNavigate();
	const { checkUserAuthStatus } = useAuth();
	const { mutateAsync: createAccount } = useCreateUserAccount();
	const { mutateAsync: signInAccount } = useSignInAccount();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof SignUpValidation>>({
		resolver: zodResolver(SignUpValidation),
	});

	const onSubmit = async ({ email, username, password }: z.infer<typeof SignUpValidation>) => {
		const newUser = await createAccount({ email, password, username });

		if (newUser instanceof AppwriteException) {
			return toaster.create({
				title: 'Sign up problem!',
				type: 'error',
				description: newUser?.message,
				placement: 'bottom-end',
				duration: 4000,
			});
		}

		const session = await signInAccount({ email, password });

		if (session instanceof AppwriteException) {
			return toaster.create({
				title: 'Sign up problem!',
				type: 'error',
				description: session?.message,
				placement: 'bottom-end',
				duration: 4000,
			});
		}

		await checkUserAuthStatus();
		navigate('/');
	};

	return (
		<>
			<Fieldset.Root>
				<Stack gap={3} mb={4}>
					<Fieldset.Legend fontSize="3xl" fontFamily="heading" fontWeight="semibold">
						Get started
					</Fieldset.Legend>
					<Fieldset.HelperText fontSize="md" fontWeight="light" color="fg.subtle">
						Create your account now
					</Fieldset.HelperText>
				</Stack>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Fieldset.Content>
						<Field
							label="Email"
							required
							invalid={!!errors.email}
							errorText={errors.email?.message}
						>
							<Input {...register('email')} type="email" />
						</Field>
						<Field
							label="Username"
							required
							invalid={!!errors.username}
							errorText={errors.username?.message}
						>
							<Input {...register('username')} type="text" />
						</Field>
						<Field
							label="Password"
							required
							invalid={!!errors.password}
							errorText={errors.password?.message}
						>
							<Input {...register('password')} type="password" />
						</Field>
						<Field
							label="Confirm password"
							required
							invalid={!!errors.confirmPassword}
							errorText={errors.confirmPassword?.message}
						>
							<Input {...register('confirmPassword')} type="password" />
						</Field>
						<Button type="submit" colorPalette="blue" py={6} disabled={isSubmitting} fontSize="md">
							{isSubmitting ? <Spinner /> : 'Submit'}
						</Button>
					</Fieldset.Content>
				</form>
				<Text mt={5} textAlign="center">
					Have an account?{' '}
					<ChakraLink color="blue.solid">
						<Link to="/sign-in">Login</Link>
					</ChakraLink>
				</Text>
			</Fieldset.Root>
		</>
	);
}
