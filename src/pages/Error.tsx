import { Link } from 'react-router-dom';
import { Box, Heading, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';

export function ErrorPage() {
	return (
		<VStack as="main" justify="center" align="center" p={5}>
			<Box textAlign="center">
				<Heading as="h1" size="2xl" color="red.500"></Heading>
				<Text fontSize="lg" mt={4}>
					Oops! The page you're looking for doesn't exist.
				</Text>

				<ChakraLink mt={6} colorPalette="blue" variant="plain" asChild>
					<Link to="/">Go back to the homepage</Link>
				</ChakraLink>
			</Box>
		</VStack>
	);
}
