import { Box } from '@chakra-ui/react';

type CalendarEventBadgeProps = { title: string };

export function CalendarEventBadge({ title }: CalendarEventBadgeProps) {
	return (
		<Box
			bg="blue.500"
			_hover={{ bg: 'blue.700' }}
			transition="backgrounds"
			color="white"
			px={2}
			py={0.5}
			w="100%"
			maxW="11/12"
			rounded="md"
			textAlign="left"
			overflow="hidden"
			whiteSpace="nowrap"
			textOverflow="ellipsis"
			cursor="pointer"
		>
			{title}
		</Box>
	);
}
