import { ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { saveNewUser } from '@/lib/appwrite/crud';
import { INewAccount, ISignInAccount, IUser } from '@/types/appwrite';

export async function createAccount(user: INewAccount) {
	const newAccount = await account.create(ID.unique(), user.email, user.password, user.username);
	const newUser = await saveNewUser({
		accountId: newAccount.$id,
		email: newAccount.email,
		name: newAccount.name,
	});

	return newUser as IUser;
}

export async function signInAccount(user: ISignInAccount) {
	await account.createEmailPasswordSession(user.email, user.password);
}

export async function signOutAccount() {
	await account.deleteSession('current');
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
