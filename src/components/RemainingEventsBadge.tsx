import { Box } from '@chakra-ui/react';

type RemainingEventsBadgeProps = { count: number };

export function RemainingEventsBadge({ count }: RemainingEventsBadgeProps) {
	return (
		<Box
			bg="gray.200"
			color="gray.500"
			_hover={{ bg: 'gray.300' }}
			transition="backgrounds"
			maxW="11/12"
			px={2}
			py={0.5}
			rounded="md"
			textAlign="left"
			cursor="pointer"
		>
			+{count} more
		</Box>
	);
}
