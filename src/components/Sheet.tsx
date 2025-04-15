import { Box, chakra, Grid, GridItem } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import {
	eachDayOfInterval,
	endOfMonth,
	getDate,
	isSameDay,
	isSameMonth,
	isSunday,
	isToday,
	lastDayOfWeek,
	setHours,
	startOfMonth,
	startOfWeek,
} from 'date-fns';

import { EventPlaceholder } from '@/components/EventPlaceholder';
import { WEEK_DAYS } from '@/constants/date';
import { useUpdateSelectedDate } from '@/store/date';
import { Event } from '@/types/appwrite';
import { filterEventsWithRecurrence } from '@/utilities/event';

const generateCalendarSheet = (date: Date) => {
	const firstDayOfMonth = startOfMonth(date);
	const lastDayOfMonth = endOfMonth(date);

	const firstWeekDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
	const lastWeekDay = lastDayOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

	const dates = eachDayOfInterval({ start: firstWeekDay, end: lastWeekDay });

	return dates;
};

type SheetProps = {
	selectedDate: Date;
	eventsQuery: UseQueryResult<Event[], Error>;
};

export function Sheet({ selectedDate, eventsQuery }: SheetProps) {
	const updateSelectedDate = useUpdateSelectedDate();
	const { data: events = [], isLoading } = eventsQuery;

	const sheet = generateCalendarSheet(startOfMonth(selectedDate));
	const rowCount = Math.ceil(sheet.length / 7);

	return (
		<>
			<Grid templateColumns="repeat(7, 1fr)">
				{WEEK_DAYS.map(day => (
					<GridItem
						key={day}
						color={day === 'sunday' ? 'red.700' : undefined}
						textAlign="center"
						fontWeight="bold"
						fontSize="xs"
					>
						{day.toUpperCase().slice(0, 1)}
					</GridItem>
				))}
			</Grid>
			<Grid
				templateColumns="repeat(7, 1fr)"
				templateRows={`repeat(${rowCount}, 1fr)`} // Ensure consistent height for rows
				height="360px"
			>
				{sheet.map(date => (
					<GridItem
						key={date.toString()}
						borderTop="2px solid"
						borderColor={isSameDay(date, selectedDate) ? 'blue.solid' : 'gray.muted'}
						color={isSunday(date) ? 'red.700' : undefined}
						textAlign="center"
						fontSize="xs"
						onClick={() => {
							updateSelectedDate(setHours(date, new Date().getHours()));
						}}
						cursor="pointer"
					>
						<chakra.h2
							fontWeight="semibold"
							opacity={isSameMonth(date, selectedDate) ? 1 : 0.4}
							my={2}
						>
							<chakra.span
								px={2}
								py={1}
								rounded="md"
								bgColor={isToday(date) ? 'blue.solid' : undefined}
							>
								{getDate(date)}
							</chakra.span>
						</chakra.h2>
						{isLoading ? (
							<EventPlaceholder />
						) : (
							filterEventsWithRecurrence(date, events)
								.slice(0, 3)
								.map(event => <Box key={event.$id} h={1} bg="blue.500" m={1} rounded="full" />)
						)}
					</GridItem>
				))}
			</Grid>
		</>
	);
}
