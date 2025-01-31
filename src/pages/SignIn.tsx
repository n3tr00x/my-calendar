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
import { useSignInAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

const SignInValidation = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(256),
});

export function SignInPage() {
	console.log('<SignInPage /> render.');
	const { mutateAsync: signInAccount } = useSignInAccount();
	const { checkUserAuthStatus } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof SignInValidation>>({
		resolver: zodResolver(SignInValidation),
	});

	const onSubmit = async ({ email, password }: z.infer<typeof SignInValidation>) => {
		try {
			await signInAccount({ email, password });
			await checkUserAuthStatus();

			navigate('/');
		} catch (error) {
			if (error instanceof AppwriteException) {
				return toaster.create({
					title: 'Sign in problem!',
					type: 'error',
					description: error?.message,
					placement: 'bottom-end',
					duration: 4000,
				});
			}
		}
	};

	return (
		<>
			<Fieldset.Root>
				<Stack gap={3} mb={4}>
					<Fieldset.Legend fontSize="3xl" fontFamily="heading" fontWeight="semibold">
						Start planning
					</Fieldset.Legend>
					<Fieldset.HelperText fontSize="md" fontWeight="light" color="fg.subtle">
						Log in to your account
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
							label="Password"
							required
							invalid={!!errors.password}
							errorText={errors.password?.message}
						>
							<Input {...register('password')} type="password" />
						</Field>
						<Button type="submit" colorPalette="blue" py={6} disabled={isSubmitting} fontSize="md">
							{isSubmitting ? <Spinner /> : 'Submit'}
						</Button>
					</Fieldset.Content>
				</form>
				<Text mt={5} textAlign="center">
					Don't have an account?{' '}
					<ChakraLink color="blue.solid" asChild>
						<Link to="/sign-up">Register</Link>
					</ChakraLink>
				</Text>
			</Fieldset.Root>
		</>
	);
}
