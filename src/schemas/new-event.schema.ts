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
		startTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
			.nullable(),
		endTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
			.nullable(),
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
	})
	.refine(
		data => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
			const repeat = data.repeat[0];

			const maxDurations = {
				daily: 1,
				weekly: 7,
				monthly: 30,
			};

			return repeat === 'no-repeat' || duration < maxDurations[repeat];
		},
		{
			message: 'Event duration must be shorter than the repeat frequency',
			path: ['endDate'],
		},
	);
