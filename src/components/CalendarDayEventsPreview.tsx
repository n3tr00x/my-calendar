import { Box, useBreakpointValue, VStack } from '@chakra-ui/react';

import { EventPopover } from '@/components/EventPopover';
import { RemainingEventsPopover } from '@/components/RemainingEventsPopover';
import { Event } from '@/types/appwrite';

type CalendarDayEventsPreviewProps = { events: Event[]; date: Date };

export function CalendarDayEventsPreview({ events, date }: CalendarDayEventsPreviewProps) {
	const MAX_VISIBLE = 3;
	const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false });

	const visibleEvents = events.slice(0, MAX_VISIBLE);
	const remainingEvents = events.slice(MAX_VISIBLE, events.length);
	const remainingCount = events.length - MAX_VISIBLE;

	return isDesktop ? (
		<VStack alignItems="initial" gap={0.5}>
			{visibleEvents.map(event => (
				<EventPopover key={event.$id} event={event} date={date} />
			))}
			{remainingCount > 0 && (
				<RemainingEventsPopover remainingEvents={remainingEvents} remainingCount={remainingCount} />
			)}
		</VStack>
	) : (
		visibleEvents.map(event => <Box key={event.$id} h={1} bg="blue.500" m={1} rounded="full" />)
	);
}
