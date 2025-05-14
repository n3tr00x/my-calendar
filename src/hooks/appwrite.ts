import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	EVENTS_QUERY_KEY,
	EVENTS_RANGE_QUERY_KEY,
	EVENTS_SEARCH_QUERY_KEY,
} from '@/constants/appwrite';
import { useAuth } from '@/hooks/useAuth';
import {
	confirmPasswordReset,
	createAccount,
	requestPasswordReset,
	signInAccount,
	signOutAccount,
	updateEmail,
	updatePassword,
	updateUsername,
} from '@/lib/appwrite/auth';
import {
	addNewEvent,
	getEvents,
	getEventsByEventName,
	removeEvent,
	setAvatarImage,
	updateEvent,
} from '@/lib/appwrite/crud';
import {
	Event,
	NewAccount,
	NewEventFormData,
	ResetPasswordParams,
	SignInAccount,
} from '@/types/appwrite';
import { generateEventsQueryKey } from '@/utilities/appwrite';
import { removeDuplicates } from '@/utilities/helpers';

export function useCreateUserAccount() {
	return useMutation({
		mutationFn: (user: NewAccount) => createAccount(user),
	});
}

export function useSignInAccount() {
	return useMutation({
		mutationFn: (user: SignInAccount) => signInAccount(user),
	});
}

export function useSignOutAccount() {
	return useMutation({
		mutationFn: () => signOutAccount(),
	});
}

export function useSetAvatar() {
	const { user } = useAuth();

	if (!user) {
		throw new Error('No user found');
	}

	return useMutation({
		mutationFn: (file: File) => setAvatarImage(file, user),
	});
}

export function useUpdatePassword() {
	return useMutation({
		mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
			updatePassword(oldPassword, newPassword),
	});
}

export function useUpdateUsername() {
	const { user } = useAuth();

	if (!user) {
		throw new Error('No user found');
	}

	return useMutation({
		mutationFn: (username: string) => updateUsername(user, username),
	});
}

export function useUpdateEmail() {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			updateEmail(email, password),
	});
}

export function useRequestPasswordReset() {
	return useMutation({
		mutationFn: (email: string) => requestPasswordReset(email),
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: ({ userId, secret, password }: ResetPasswordParams) =>
			confirmPasswordReset(userId, secret, password),
	});
}

export function useEvents(date: Date) {
	const EVENTS_DATE_QUERY_KEY = generateEventsQueryKey(date);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const query = useQuery({
		queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY, EVENTS_DATE_QUERY_KEY],
		queryFn: async () => {
			const fetchedEvents = await getEvents(date);
			const queries = queryClient.getQueriesData({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});

			const cachedEvents = queries
				.map(entry => entry[1])
				.filter(events => Array.isArray(events))
				.flat() as Event[];

			const mergedEvents = [...cachedEvents, ...fetchedEvents];
			const uniquedEvents = removeDuplicates(mergedEvents, '$id');

			return uniquedEvents;
		},
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60, // 1h,
	});

	if (query.isError) {
		navigate('/sign-in');
	}

	return query;
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
	const { user } = useAuth();

	return useMutation({
		mutationFn: (event: NewEventFormData) => {
			if (!user) {
				throw new Error('User not authenticated');
			}
			return addNewEvent(event, user);
		},
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
			editedEvent: Partial<NewEventFormData>;
		}) => updateEvent(eventId, editedEvent),
		onSuccess: updatedEvent => {
			queryClient.invalidateQueries({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});

			queryClient.setQueriesData(
				{ queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY] },
				(previousCachedEvents: Event[]) => {
					const removedPreviousCachedEvent = previousCachedEvents.filter(
						event => event.$id !== updatedEvent.$id,
					);

					return [...removedPreviousCachedEvent, updatedEvent];
				},
			);
		},
	});
}

export function useRemoveEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (eventId: string) => removeEvent(eventId),
		onSuccess: (_, eventId) => {
			queryClient.invalidateQueries({
				queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY],
			});

			queryClient.setQueriesData(
				{ queryKey: [EVENTS_QUERY_KEY, EVENTS_RANGE_QUERY_KEY] },
				(previousCachedEvents: Event[]) => {
					return previousCachedEvents.filter(event => event.$id !== eventId);
				},
			);
		},
	});
}
