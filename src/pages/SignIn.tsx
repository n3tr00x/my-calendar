import { Link } from 'react-router-dom';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Link as ChakraLink,
	Text,
	VStack,
} from '@chakra-ui/react';

export function SignInPage() {
	console.log('<SignInPage /> render.');

	return (
		<>
			<Text fontSize="3xl" fontWeight="semibold">
				Start planning
			</Text>
			<Text mb={10} fontWeight="light" color="gray.700">
				Log in to your account
			</Text>
			<VStack gap={4}>
				<FormControl isRequired>
					<FormLabel>Email</FormLabel>
					<Input type="email" />
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Password</FormLabel>
					<Input type="password" />
				</FormControl>
				<Button type="submit" w="full" colorScheme="cyan" color="white" py={6}>
					Sign up
				</Button>
			</VStack>
			<Text mt={10} textAlign="center">
				Don't have an account?{' '}
				<ChakraLink color="cyan.500">
					<Link to="/sign-up">Login</Link>
				</ChakraLink>
			</Text>
		</>
	);
}
