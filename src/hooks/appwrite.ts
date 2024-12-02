import { useMutation } from '@tanstack/react-query';

import { createAccount, signInAccount, signOutAccount } from '@/lib/appwrite/auth';
import { INewAccount, ISignInAccount } from '@/types/appwrite';

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
