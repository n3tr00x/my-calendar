import { z } from 'zod';

const validateDateOrder = (startDate: string, endDate: string) => {
	return new Date(endDate) >= new Date(startDate);
};

const validateTimeOrder = (startTime: string | null, endTime: string | null) => {
	if (!startTime || !endTime) {
		return true;
	}

	const [startMinutes, startSeconds] = startTime.split(':').map(Number);
	const [endMinutes, endSeconds] = endTime.split(':').map(Number);

	const startTotalSeconds = startMinutes * 60 + startSeconds;
	const endTotalSeconds = endMinutes * 60 + endSeconds;

	return endTotalSeconds >= startTotalSeconds;
};

export const NewEventSchema = z
	.object({
		title: z.string().min(1, 'Title is required').trim(),
		isAllDay: z.boolean(),
		startDate: z.string().date(),
		endDate: z.string().date(),
		startTime: z.string().time().nullable(),
		endTime: z.string().time().nullable(),
		description: z.string().nullable(),
		location: z.string().nullable(),
		repeat: z.array(z.enum(['no-repeat', 'daily', 'weekly', 'monthly'])),
	})
	.refine(event => validateDateOrder(event.startDate, event.endDate), {
		message: 'End date cannot be earlier than start date',
		path: ['endDate'],
	})
	.refine(event => validateTimeOrder(event.startTime, event.endTime), {
		message: 'End time cannot be earlier than start time',
		path: ['endTime'],
	});
