import { ID } from 'appwrite';

import { config, databases } from '@/lib/appwrite';
import { INewUser } from '@/types/appwrite';

export async function saveNewUser(user: INewUser) {
	try {
		const newUser = await databases.createDocument(
			config.databaseId,
			config.usersCollectionId,
			ID.unique(),
			user,
		);

		return newUser;
	} catch (error) {
		console.error('saveNewUser', error);
		return error;
	}
}
