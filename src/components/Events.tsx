import { Box, Text } from '@chakra-ui/react';

import { EmptyEventList } from '@/components/EmptyEventList';
import { EventList } from '@/components/EventList';
import { useEvents } from '@/hooks/appwrite';
import { useSelectedDate } from '@/store/date';
import { useRepeatedEvents } from '@/store/events';
import { formatShortDate } from '@/utilities/date';
import { filterEventsWithRecurrence } from '@/utilities/event';
import { removeDuplicates } from '@/utilities/helpers';

export function Events() {
	console.log('<EventList /> render.');

	const selectedDate = useSelectedDate();
	const repeatedEvents = useRepeatedEvents();
	const { data: events = [], isLoading: isEventLoading } = useEvents(selectedDate);

	if (isEventLoading) {
		return <p>Loading...</p>;
	}

	const removedDuplicates = removeDuplicates(events.concat(repeatedEvents), '$id');
	const eventsWithNoRepetition = filterEventsWithRecurrence(selectedDate, removedDuplicates);

	return (
		<Box as="section" id="events" mx={3} my={2}>
			<Text fontSize="xs" color="gray" fontFamily="heading">
				<span>{formatShortDate(selectedDate)}</span>
			</Text>
			{!eventsWithNoRepetition || eventsWithNoRepetition.length === 0 ? (
				<EmptyEventList />
			) : (
				<EventList events={eventsWithNoRepetition} />
			)}
		</Box>
	);
}
