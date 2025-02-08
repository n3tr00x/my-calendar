import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createAccount, signInAccount, signOutAccount } from '@/lib/appwrite/auth';
import { addNewEvent, getEvents } from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount, NewEvent } from '@/types/appwrite';

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
	return useQuery({
		queryKey: ['events', date],
		queryFn: () => getEvents(date),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60, // 1h,
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
