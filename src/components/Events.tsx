import { Box, Text } from '@chakra-ui/react';

import { EmptyEventList } from '@/components/EmptyEventList';
import { EventList } from '@/components/EventList';
import { useEvents } from '@/hooks/appwrite';
import { useSelectedDate } from '@/store/date';
import { formatShortDate } from '@/utilities/date';
import { filterEventsWithRecurrence } from '@/utilities/event';

export function Events() {
	console.log('<EventList /> render.');

	const selectedDate = useSelectedDate();
	const { data: events = [], isLoading: isEventLoading } = useEvents(selectedDate);

	if (isEventLoading) {
		return <p>Loading...</p>;
	}

	const eventsWithRecurrence = filterEventsWithRecurrence(selectedDate, events);

	return (
		<Box as="section" id="events" mx={3} my={2}>
			<Text fontSize="xs" color="gray" fontFamily="heading">
				<span>{formatShortDate(selectedDate)}</span>
			</Text>
			{!eventsWithRecurrence || eventsWithRecurrence.length === 0 ? (
				<EmptyEventList />
			) : (
				<EventList events={eventsWithRecurrence} />
			)}
		</Box>
	);
}
