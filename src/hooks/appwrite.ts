import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	EVENTS_QUERY_KEY,
	EVENTS_RANGE_QUERY_KEY,
	EVENTS_SEARCH_QUERY_KEY,
} from '@/constants/appwrite';
import { createAccount, signInAccount, signOutAccount } from '@/lib/appwrite/auth';
import {
	addNewEvent,
	getEvents,
	getEventsByEventName,
	removeEvent,
	updateEvent,
} from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount, NewEvent, NewEventForm } from '@/types/appwrite';
import { generateEventsQueryKey } from '@/utilities/appwrite';

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
	const EVENTS_DATE_QUERY_KEY = generateEventsQueryKey(date);

	return useQuery({
		queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY, EVENTS_DATE_QUERY_KEY],
		queryFn: () => getEvents(date),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60, // 1h,
	});
}

export function useSearchedEvents(eventName: string) {
	return useQuery({
		queryKey: [EVENTS_QUERY_KEY, EVENTS_SEARCH_QUERY_KEY, eventName],
		queryFn: () => getEventsByEventName(eventName),
		enabled: !!eventName,
	});
}

export function useAddNewEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (event: NewEvent) => addNewEvent(event),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});
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
			queryClient.invalidateQueries({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});
		},
	});
}

export function useRemoveEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (eventId: string) => removeEvent(eventId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});
		},
	});
}
