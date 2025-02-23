import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, subMonths } from 'date-fns';

import { createAccount, signInAccount, signOutAccount } from '@/lib/appwrite/auth';
import {
	addNewEvent,
	getEvents,
	getEventsByEventName,
	removeEvent,
	updateEvent,
} from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount, NewEvent, NewEventForm } from '@/types/appwrite';
import { formatDateToMonthYear } from '@/utilities/date';

export function useCreateUserAccount() {
	return useMutation({
		mutationFn: (user: INewAccount) => createAccount(user),
	});
}

export function useSignInAccount() {
	return useMutation({
		mutationFn: (user: ISignInAccount) => signInAccount(user),
	});
}

export function useSignOutAccount() {
	return useMutation({
		mutationFn: () => signOutAccount(),
	});
}

export function useEvents(date: Date) {
	const formattedDate = formatDateToMonthYear(date);
	const prevMonthDate = formatDateToMonthYear(subMonths(date, 1));
	const nextMonthDate = formatDateToMonthYear(addMonths(date, 1));

	return useQuery({
		queryKey: ['events', prevMonthDate, formattedDate, nextMonthDate],
		queryFn: () => getEvents(date),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60, // 1h,
	});
}

export function useSearchedEvents(eventName: string) {
	return useQuery({
		queryKey: ['events', 'search', eventName],
		queryFn: () => getEventsByEventName(eventName),
		enabled: !!eventName,
	});
}

export function useAddNewEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (event: NewEvent) => addNewEvent(event),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
}

export function useEditEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			eventId,
			editedEvent,
		}: {
			eventId: string;
			editedEvent: Partial<NewEventForm>;
		}) => updateEvent(eventId, editedEvent),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
}

export function useRemoveEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (eventId: string) => removeEvent(eventId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
}
