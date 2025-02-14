import { Box, Flex, Text } from '@chakra-ui/react';
import { CalendarRange } from 'lucide-react';

import { Event } from '@/types/appwrite';

type SavedEventProps = { event: Event };

export function SavedEvent({ event }: SavedEventProps) {
	return (
		<Flex gap={2} px={3} py={5} minH={20}>
			<Box w={10} alignSelf="flex-start">
				{event.isAllDay ? (
					<CalendarRange />
				) : (
					<Text fontSize="sm" fontWeight="bold">
						{event.startTime}
					</Text>
				)}
			</Box>
			<Box width={1.5} rounded="xl" backgroundColor="blue.500" />
			<Box>
				<Text fontFamily="heading" fontSize="sm">
					{event.title}
				</Text>
				<Text fontSize="xs" color="gray.500">
					{event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}
				</Text>
			</Box>
		</Flex>
	);
}
