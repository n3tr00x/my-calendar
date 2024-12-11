import { useState } from 'react';
import { Box, Button, chakra, Grid, GridItem } from '@chakra-ui/react';
import {
	eachDayOfInterval,
	endOfMonth,
	getDate,
	isSameDay,
	isSameMonth,
	isSunday,
	isToday,
	lastDayOfWeek,
	startOfMonth,
	startOfWeek,
} from 'date-fns';

import { MonthNavigator } from './MonthNavigator';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const generateCalendarSheet = (date: Date) => {
	const firstDayOfMonth = startOfMonth(date);
	const lastDayOfMonth = endOfMonth(date);

	const firstWeekDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
	const lastWeekDay = lastDayOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

	const dates = eachDayOfInterval({ start: firstWeekDay, end: lastWeekDay });

	return dates;
};

export function Calendar() {
	console.log('<Calendar /> render');
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(today);
	const sheet = generateCalendarSheet(selectedDate);

	return (
		<Box id="calendar" mx={2}>
			<MonthNavigator date={selectedDate} onDateChange={setSelectedDate} />
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
				{sheet.map(date => (
					<GridItem
						key={date.toString()}
						aspectRatio="1/1"
						borderTop="1px solid"
						borderColor="gray.300"
						color={isSunday(date) ? 'red.700' : undefined}
						textAlign="center"
						fontSize="xs"
						onClick={() => setSelectedDate(date)}
					>
						<chakra.h2
							fontWeight="semibold"
							bgColor={isToday(date) ? 'primary.700' : undefined}
							color={isToday(date) ? 'neutral.100' : undefined}
							opacity={isSameMonth(date, selectedDate) ? 1 : 0.4}
						>
							{getDate(date)}
						</chakra.h2>
					</GridItem>
				))}
			</Grid>
		</Box>
	);
}
