import { addDays, differenceInDays, getDate, isWithinInterval } from 'date-fns';

import { Event } from '@/types/appwrite';

export const filterEventsWithRecurrence = (date: Date, events: Event[]) => {
	return events.filter(event => {
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);
		const duration = differenceInDays(eventEnd, eventStart); // Długość wydarzenia w dniach

		if (event.repeat === 'no-repeat') {
			return isWithinInterval(date, { start: eventStart, end: eventEnd });
		}

		if (event.repeat === 'daily') {
			return date >= eventStart;
		}

		if (event.repeat === 'weekly') {
			for (let i = 0; i <= duration; i++) {
				const occurrenceDate = addDays(eventStart, i);
				if (date >= eventStart && date.getDay() === occurrenceDate.getDay()) {
					return true;
				}
			}
		}

		if (event.repeat === 'monthly') {
			for (let i = 0; i <= duration; i++) {
				const occurrenceDate = addDays(eventStart, i);
				if (date >= eventStart && getDate(date) === getDate(occurrenceDate)) {
					return true;
				}
			}
		}

		return false;
	});
};
