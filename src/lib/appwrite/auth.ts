import { ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { saveNewUser } from '@/lib/appwrite/crud';
import { NewAccount, SignInAccount, User } from '@/types/appwrite';

export async function updateVerification(userId: string, token: string) {
	await account.updateVerification(userId, token);
}

export async function verifyEmail() {
	const origin = window.location.origin;
	await account.createVerification(origin + '/verify-email');
}

export async function createAccount(user: NewAccount) {
	const newAccount = await account.create(ID.unique(), user.email, user.password, user.username);
	await signInAccount(user);
	await verifyEmail();
	await signOutAccount();

	const newUser = await saveNewUser({
		accountId: newAccount.$id,
		email: newAccount.email,
		name: newAccount.name,
	});

	return newUser as User;
}

export async function signInAccount(user: SignInAccount) {
	await account.createEmailPasswordSession(user.email, user.password);
}

export async function signOutAccount() {
	await account.deleteSession('current');
}

export async function updateUsername(user: User, username: string) {
	await databases.updateDocument(config.databaseId, config.usersCollectionId, user.$id, {
		name: username,
	});
	await account.updateName(username);
}

export async function updatePassword(oldPassword: string, newPassword: string) {
	await account.updatePassword(newPassword, oldPassword);
}

export async function updateEmail(newEmail: string, password: string) {
	const user = await getCurrentUser();

	await account.updateEmail(newEmail, password);
	await databases.updateDocument(config.databaseId, config.usersCollectionId, user.$id, {
		email: newEmail,
	});
	await verifyEmail();
}

export async function requestPasswordReset(email: string) {
	const redirectUrl = `${window.location.origin}/reset-password`;
	await account.createRecovery(email, redirectUrl);
}

export async function confirmPasswordReset(userId: string, secret: string, newPassword: string) {
	await account.updateRecovery(userId, secret, newPassword);
}

export async function getCurrentUser() {
	const currentAccount = await account.get();

	if (!currentAccount.emailVerification) {
		await signOutAccount();
		throw new Error('An email is not verified.');
	}

	const { documents } = await databases.listDocuments(config.databaseId, config.usersCollectionId, [
		Query.equal('accountId', currentAccount.$id),
	]);

	if (documents.length === 0) {
		throw new Error('User not found.');
	}

	return documents[0] as User;
}
