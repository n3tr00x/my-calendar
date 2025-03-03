import { Box, chakra, Grid, GridItem } from '@chakra-ui/react';
import {
	eachDayOfInterval,
	endOfMonth,
	getDate,
	isSameDay,
	isSameMonth,
	isSunday,
	isToday,
	isWithinInterval,
	lastDayOfWeek,
	setHours,
	startOfMonth,
	startOfWeek,
} from 'date-fns';

import { EventPlaceholder } from '@/components/EventPlaceholder';
import { useEvents } from '@/hooks/appwrite';
import { useDate } from '@/hooks/useDate';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const generateCalendarSheet = (date: Date) => {
	const firstDayOfMonth = startOfMonth(date);
	const lastDayOfMonth = endOfMonth(date);

	const firstWeekDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
	const lastWeekDay = lastDayOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

	const dates = eachDayOfInterval({ start: firstWeekDay, end: lastWeekDay });

	return dates;
};

export function Sheet({ selectedDate }: { selectedDate: Date }) {
	const { onDateChange } = useDate();
	const { data: events, isLoading } = useEvents(selectedDate);

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
				height={80}
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
							onDateChange(setHours(date, new Date().getHours()));
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
							events
								?.filter(event =>
									isWithinInterval(date, {
										start: new Date(event.startDate),
										end: new Date(event.endDate),
									}),
								)
								.slice(0, 3)
								.map(event => <Box key={event.$id} h={1} bg="blue.500" m={1} rounded="full" />)
						)}
					</GridItem>
				))}
			</Grid>
		</>
	);
}
