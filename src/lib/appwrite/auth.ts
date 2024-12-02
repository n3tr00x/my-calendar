import { AppwriteException, ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { saveNewUser } from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount } from '@/types/appwrite';

export async function createAccount(user: INewAccount) {
	try {
		const newAccount = await account.create(ID.unique(), user.email, user.password, user.username);
		const newUser = await saveNewUser({
			accountId: newAccount.$id,
			email: newAccount.email,
			name: newAccount.name,
		});

		return newUser;
	} catch (error) {
		if (error instanceof AppwriteException) {
			console.error('create account', error);
			return error;
		}
	}
}

export async function signInAccount(user: ISignInAccount) {
	try {
		const session = await account.createEmailPasswordSession(user.email, user.password);
		return session;
	} catch (error) {
		console.error('sign in account', error);
		return error;
	}
}

export async function signOutAccount() {
	try {
		const session = await account.deleteSession('current');
		return session;
	} catch (error) {
		console.error('sign out account', error);
		return error;
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();
		const currentUser = await databases.listDocuments(config.databaseId, config.usersCollectionId, [
			Query.equal('accountId', currentAccount.$id),
		]);

		return currentUser.documents[0];
	} catch (error) {
		return error;
	}
}
