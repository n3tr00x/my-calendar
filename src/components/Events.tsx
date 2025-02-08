import { Box, Text } from '@chakra-ui/react';

import { EmptyEventList } from '@/components/EmptyEventList';
import { EventList } from '@/components/EventList';
import { useEvents } from '@/hooks/appwrite';
import { useDate } from '@/hooks/useDate';
import { formatShortDate } from '@/utilities/date';

export function Events() {
	console.log('<EventList /> render.');

	const { date: selectedDate } = useDate();
	const { data: events, isLoading: isEventLoading } = useEvents(selectedDate);

	if (isEventLoading) {
		return <p>Loading...</p>;
	}

	return (
		<Box as="section" id="events" mx={3} my={2}>
			<Text fontSize="xs" color="gray" fontFamily="heading">
				<span>{formatShortDate(selectedDate)}</span>
			</Text>
			{!events || events?.length === 0 ? <EmptyEventList /> : <EventList events={events} />}
		</Box>
	);
}
