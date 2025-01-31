import { AppwriteException, ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { saveNewUser } from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount, IUser } from '@/types/appwrite';

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
	const currentAccount = await account.get();
	const { documents } = await databases.listDocuments(config.databaseId, config.usersCollectionId, [
		Query.equal('accountId', currentAccount.$id),
	]);

	if (documents.length === 0) {
		throw new Error('User not found.');
	}

	return documents[0] as IUser;
}
