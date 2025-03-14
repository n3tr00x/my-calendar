import { getDate, isWithinInterval } from 'date-fns';

import { Event } from '@/types/appwrite';

export const filterEventsWithRecurrence = (date: Date, events: Event[]) => {
	return events.filter(event => {
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);

		if (event.repeat === 'no-repeat') {
			return isWithinInterval(date, { start: eventStart, end: eventEnd });
		}

		if (event.repeat === 'daily') {
			return date >= eventStart;
		}

		if (event.repeat === 'weekly') {
			return date >= eventStart && date.getDay() === eventStart.getDay();
		}

		if (event.repeat === 'monthly') {
			return date >= eventStart && getDate(date) === getDate(eventStart);
		}

		return false;
	});
};
