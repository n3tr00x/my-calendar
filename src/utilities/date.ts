import { add, addMonths, format, set, startOfMonth, subMonths } from 'date-fns';

export const getStartOfPreviousMonth = (date: Date) => {
	return startOfMonth(subMonths(date, 1));
};

export const getStartOfNextMonth = (date: Date) => {
	return startOfMonth(addMonths(date, 1));
};

export const addHoursAndResetMinutes = (date: Date, hours?: number) => {
	const newDate = add(date, { hours: hours || 1 });
	const resettedMinutesDate = set(newDate, { minutes: 0, seconds: 0, milliseconds: 0 });
	return format(resettedMinutesDate, 'HH:mm');
};

export const formatToISODate = (date: Date | string) => {
	return new Date(date).toISOString().split('T')[0];
};

export const formatDateToYearMonthDay = (date: Date) => {
	return format(date, 'yyyy-MM-dd');
};
