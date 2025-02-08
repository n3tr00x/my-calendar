import { Fragment } from 'react';
import { Box, Flex, Separator, Text } from '@chakra-ui/react';
import { CalendarRange } from 'lucide-react';

import { Event } from '@/types/appwrite';

type EventListProps = {
	events: Event[];
};

function SavedEvent({ event }: { event: Event }) {
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
					<SavedEvent event={event} />
					{index !== allDayEvents.length - 1 && <Separator />}
				</Fragment>
			))}
			{isNoneAllDayEventsExists && isAllDayEventsExists && <Separator />}
			{sortedNonAllDayEvents.map((event, index) => (
				<Fragment key={event.$id}>
					<SavedEvent key={event.$id} event={event} />
					{index !== sortedNonAllDayEvents.length - 1 && <Separator />}
				</Fragment>
			))}
		</Box>
	);
}
