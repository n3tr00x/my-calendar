import { Box, Text } from '@chakra-ui/react';
import { isWithinInterval } from 'date-fns';

import { EmptyEventList } from '@/components/EmptyEventList';
import { EventList } from '@/components/EventList';
import { useEvents } from '@/hooks/appwrite';
import { useSelectedDate } from '@/store/date';
import { formatShortDate } from '@/utilities/date';

export function Events() {
	console.log('<EventList /> render.');

	const selectedDate = useSelectedDate();
	const { data: events, isLoading: isEventLoading } = useEvents(selectedDate);

	if (isEventLoading) {
		return <p>Loading...</p>;
	}

	const filteredEvents = events?.filter(event =>
		isWithinInterval(selectedDate, {
			start: new Date(event.startDate),
			end: new Date(event.endDate),
		}),
	);

	return (
		<Box as="section" id="events" mx={3} my={2}>
			<Text fontSize="xs" color="gray" fontFamily="heading">
				<span>{formatShortDate(selectedDate)}</span>
			</Text>
			{!filteredEvents || filteredEvents?.length === 0 ? (
				<EmptyEventList />
			) : (
				<EventList events={filteredEvents} />
			)}
		</Box>
	);
}
