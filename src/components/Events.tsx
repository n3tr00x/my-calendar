import { Box, Text } from '@chakra-ui/react';

import { EmptyEventList } from '@/components/EmptyEventList';
import { EventList } from '@/components/EventList';
import { EventListSkeleton } from '@/components/EventListSkeleton';
import { useEvents } from '@/hooks/appwrite';
import { useSelectedDate } from '@/store/date';
import { formatShortDate } from '@/utilities/date';
import { filterEventsWithRecurrence } from '@/utilities/event';

export function Events() {
	console.log('<EventList /> render.');

	const selectedDate = useSelectedDate();
	const { data: events = [], isLoading } = useEvents(selectedDate);

	const eventsWithRecurrence = filterEventsWithRecurrence(selectedDate, events);

	return (
		<Box as="section" id="events" mx={3} my={2} display={{ base: 'block', lg: 'none' }}>
			<Text fontSize="xs" color="gray" fontFamily="heading">
				<span>{formatShortDate(selectedDate)}</span>
			</Text>
			{isLoading ? (
				<EventListSkeleton />
			) : !eventsWithRecurrence || eventsWithRecurrence.length === 0 ? (
				<EmptyEventList />
			) : (
				<EventList events={eventsWithRecurrence} />
			)}
		</Box>
	);
}
