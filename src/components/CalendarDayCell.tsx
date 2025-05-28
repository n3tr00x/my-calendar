import { chakra, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { getDate, isSameDay, isSameMonth, isSunday, isToday, setHours } from 'date-fns';

import { CalendarDayEventsPreview } from '@/components/CalendarDayEventsPreview';
import { EventPlaceholder } from '@/components/EventPlaceholder';
import { useSelectedDate, useUpdateSelectedDate } from '@/store/date';
import { useModal } from '@/store/modal';
import { Event } from '@/types/appwrite';
import { filterEventsWithRecurrence } from '@/utilities/event';

type CalendarDayCellProps = {
	date: Date;
	query: UseQueryResult<Event[], Error>;
};

export function CalendarDayCell({ date, query }: CalendarDayCellProps) {
	const { data: events = [], isLoading } = query;

	const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false });
	const { onEventFormOpen } = useModal();
	const selectedDate = useSelectedDate();
	const updateSelectedDate = useUpdateSelectedDate();

	const dataChangeHandler = () => {
		if (isDesktop) {
			onEventFormOpen();
		}

		updateSelectedDate(setHours(date, new Date().getHours()));
	};

	return (
		<GridItem
			height="full"
			borderTop="2px solid"
			borderColor={isSameDay(date, selectedDate) ? 'blue.solid' : 'gray.muted'}
			color={isSunday(date) ? 'red.700' : undefined}
			textAlign="center"
			fontSize="xs"
			overflow="hidden"
			_active={{ cursor: 'grabbing' }}
			onClick={dataChangeHandler}
		>
			<chakra.h2 fontWeight="semibold" opacity={isSameMonth(date, selectedDate) ? 1 : 0.4} my={2}>
				<chakra.span px={2} py={1} rounded="md" bgColor={isToday(date) ? 'blue.solid' : undefined}>
					{getDate(date)}
				</chakra.span>
			</chakra.h2>
			{isLoading ? (
				<EventPlaceholder />
			) : (
				<CalendarDayEventsPreview date={date} events={filterEventsWithRecurrence(date, events)} />
			)}
		</GridItem>
	);
}
