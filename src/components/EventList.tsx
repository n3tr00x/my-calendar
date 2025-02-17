import { Fragment } from 'react';
import { Box, Separator } from '@chakra-ui/react';

import { SavedEvent } from '@/components/SavedEvent';
import { Event } from '@/types/appwrite';

type EventListProps = { events: Event[] };

export function EventList({ events }: EventListProps) {
	const allDayEvents = events.filter(event => event.isAllDay);
	const noneAllDayEvents = events.filter(event => !event.isAllDay);
	const sortedNonAllDayEvents = [...noneAllDayEvents].sort((a, b) => {
		const timeToMinutes = (time: string) => {
			const [hours, minutes] = time.split(':').map(Number);
			return hours * 60 + minutes;
		};

		return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
	});

	const isNoneAllDayEventsExists = !noneAllDayEvents || noneAllDayEvents.length !== 0;
	const isAllDayEventsExists = !allDayEvents || allDayEvents.length !== 0;

	return (
		<Box
			id="event-list"
			maxHeight={64}
			overflowY="scroll"
			css={{
				'&::-webkit-scrollbar': {
					width: '4px',
				},
				'&::-webkit-scrollbar-track': {
					background: 'transparent',
				},
				'&::-webkit-scrollbar-thumb': {
					background: 'gray.700',
					borderRadius: '4px',
				},
			}}
		>
			{allDayEvents.map((event, index) => (
				<Fragment key={event.$id}>
					<SavedEvent event={event} savedEventStyles={{ px: 3, py: 5, minH: 20 }} />
					{index !== allDayEvents.length - 1 && <Separator />}
				</Fragment>
			))}
			{isNoneAllDayEventsExists && isAllDayEventsExists && <Separator />}
			{sortedNonAllDayEvents.map((event, index) => (
				<Fragment key={event.$id}>
					<SavedEvent event={event} savedEventStyles={{ px: 3, py: 5, minH: 20 }} />
					{index !== sortedNonAllDayEvents.length - 1 && <Separator />}
				</Fragment>
			))}
		</Box>
	);
}
