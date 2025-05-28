import { add, addMonths, format, set, startOfMonth, subMonths } from 'date-fns';

export const getStartOfPreviousMonth = (date: Date) => {
	return startOfMonth(subMonths(date, 1));
};

export const getStartOfNextMonth = (date: Date) => {
	return startOfMonth(addMonths(date, 1));
};

export const addHoursAndResetMinutes = (date: Date | string, hours?: number) => {
	const newDate = add(new Date(date), { hours: hours || 1 });
	const resettedMinutesDate = set(newDate, { minutes: 0, seconds: 0, milliseconds: 0 });
	return format(resettedMinutesDate, 'HH:mm');
};

export const formatToISODate = (date: Date | string) => {
	return new Date(date).toISOString().split('T')[0];
};

export const formatDateToYearMonthDay = (date: Date | string) => {
	return format(date, 'yyyy-MM-dd');
};

export const formatShortDate = (date: Date) => {
	return format(date, 'd MMM');
};

export const formatDateToMonthYear = (date: Date) => {
	return format(date, 'LLLL yyyy');
};

export const formatLongDate = (date: Date) => {
	return format(date, 'EEEE, d MMMM');
};
