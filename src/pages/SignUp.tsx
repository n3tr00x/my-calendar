import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { WarningIcon } from '@chakra-ui/icons';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Link as ChakraLink,
	Spinner,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { z } from 'zod';

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
	const toast = useToast();
	const navigate = useNavigate();
	const { checkUserAuthStatus } = useAuth();
	const { mutateAsync: createAccount, isPending: isCreateAccountPending } = useCreateUserAccount();
	const { mutateAsync: signInAccount, isPending: isSignInPending } = useSignInAccount();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof SignUpValidation>>({
		resolver: zodResolver(SignUpValidation),
	});

	const onSubmit = async ({ email, username, password }: z.infer<typeof SignUpValidation>) => {
		const newUser = await createAccount({ email, password, username });

		if (newUser instanceof AppwriteException) {
			toast({
				title: 'Sign up problem!',
				description: newUser.message,
				position: 'top',
				status: 'error',
				duration: 7000,
				isClosable: true,
			});
			return;
		}

		const session = await signInAccount({ email, password });

		if (session instanceof AppwriteException) {
			toast({
				title: 'Sign in problem!',
				description: session?.message,
				position: 'top',
				status: 'error',
				duration: 7000,
				isClosable: true,
			});
			return;
		}

		await checkUserAuthStatus();
		navigate('/');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Text fontSize="3xl" fontWeight="semibold">
				Get started
			</Text>
			<Text mb={10} fontWeight="light" color="gray.700">
				Create your account now
			</Text>
			<VStack gap={4}>
				<FormControl isRequired isInvalid={!!errors.username}>
					<FormLabel>Username</FormLabel>
					<Input {...register('username')} />
					<FormErrorMessage>
						<WarningIcon mr={1} />
						{errors.username?.message}
					</FormErrorMessage>
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.email}>
					<FormLabel>Email</FormLabel>
					<Input {...register('email')} type="email" />
					<FormErrorMessage>
						<WarningIcon mr={1} />
						{errors.email?.message}
					</FormErrorMessage>
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.password}>
					<FormLabel>Password</FormLabel>
					<Input {...register('password')} type="password" />
					<FormErrorMessage>
						<WarningIcon mr={1} />
						{errors.password?.message}
					</FormErrorMessage>
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.confirmPassword}>
					<FormLabel>Confirm password</FormLabel>
					<Input {...register('confirmPassword')} type="password" />
					<FormErrorMessage>
						<WarningIcon mr={1} />
						{errors.confirmPassword?.message}
					</FormErrorMessage>
				</FormControl>
				<Button
					type="submit"
					disabled={isCreateAccountPending}
					w="full"
					colorScheme="primary"
					color="neutral.100"
					py={6}
				>
					{isCreateAccountPending || isSignInPending ? <Spinner color="white" /> : 'Sign up'}
				</Button>
			</VStack>
			<Text mt={10} textAlign="center">
				Have an account?{' '}
				<ChakraLink color="primary.700">
					<Link to="/sign-in">Login</Link>
				</ChakraLink>
			</Text>
		</form>
	);
}
