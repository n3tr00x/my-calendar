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

export function SignUpPage() {
	console.log('<SignUpPage /> render.');

	return (
		<>
			<Text fontSize="3xl" fontWeight="semibold">
				Get started
			</Text>
			<Text mb={10} fontWeight="light" color="gray.700">
				Create your account now
			</Text>
			<VStack gap={4}>
				<FormControl isRequired>
					<FormLabel>Full name</FormLabel>
					<Input type="text" />
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Email</FormLabel>
					<Input type="email" />
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Password</FormLabel>
					<Input type="password" />
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Confirm password</FormLabel>
					<Input type="password" />
				</FormControl>
				<Button type="submit" w="full" colorScheme="cyan" color="white" py={6}>
					Sign up
				</Button>
			</VStack>
			<Text mt={10} textAlign="center">
				Have an account?{' '}
				<ChakraLink color="cyan.500">
					<Link to="/sign-in">Login</Link>
				</ChakraLink>
			</Text>
		</>
	);
}
