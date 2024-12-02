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
	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof SignInValidation>>({
		resolver: zodResolver(SignInValidation),
	});

	const onSubmit = async ({ email, password }: z.infer<typeof SignInValidation>) => {
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
				Start planning
			</Text>
			<Text mb={10} fontWeight="light" color="gray.700">
				Log in to your account
			</Text>
			<VStack gap={4}>
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
				<Button
					type="submit"
					disabled={isSubmitting}
					w="full"
					colorScheme="primary"
					color="white"
					py={6}
				>
					{isSubmitting ? <Spinner color="white" /> : 'Sign in'}
				</Button>
			</VStack>
			<Text mt={10} textAlign="center">
				Don't have an account?{' '}
				<ChakraLink color="primary.700">
					<Link to="/sign-up">Register</Link>
				</ChakraLink>
			</Text>
		</form>
	);
}
