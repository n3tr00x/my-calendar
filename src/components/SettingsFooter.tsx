import { Box, Flex, Text } from '@chakra-ui/react';

export function SettingsFooter() {
	const year = new Date().getFullYear();
	const appVersion = 'v' + __APP_VERSION__;

	return (
		<Box as="footer" my={4}>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				align="center"
				justify="space-between"
				px={4}
				textAlign={{ base: 'center', md: 'left' }}
				fontSize="sm"
				color="gray.500"
			>
				<Text fontWeight="semibold">
					My Calendar{' '}
					<Text as="span" color="gray.400">
						({appVersion})
					</Text>
				</Text>
				<Text>
					© {year} {__APP_AUTHOR__} • All rights reserved
				</Text>
			</Flex>
		</Box>
	);
}
