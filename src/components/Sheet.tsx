import { Grid, GridItem } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { eachDayOfInterval, endOfMonth, lastDayOfWeek, startOfMonth, startOfWeek } from 'date-fns';

import { CalendarDayCell } from '@/components/CalendarDayCell';
import { WEEK_DAYS } from '@/constants/date';
import { Event } from '@/types/appwrite';

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
				height={{ base: '360px', lg: 'full' }}
			>
				{sheet.map(date => (
					<CalendarDayCell key={date.toDateString()} date={date} query={eventsQuery} />
				))}
			</Grid>
		</>
	);
}
