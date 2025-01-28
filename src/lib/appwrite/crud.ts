import { ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { INewUser, NewEvent } from '@/types/appwrite';

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

export async function getEvents(date: string) {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) {
			throw new Error('No logged user.');
		}

		console.log('get events', new Date(date).toISOString());

		const events = await databases.listDocuments(config.databaseId, config.eventsCollectionId, [
			Query.equal('accountId', currentAccount.$id),
			Query.and([
				Query.lessThanEqual('startDate', new Date(date).toISOString()),
				Query.greaterThanEqual('endDate', new Date(date).toISOString()),
			]),
		]);

		return events;
	} catch (error) {
		console.error('getEvents');
		return error;
	}
}

export async function addNewEvent(event: NewEvent) {
	try {
		const processedDates = {
			startDate: new Date(event.startDate).toISOString(),
			endDate: new Date(event.endDate).toISOString(),
		};

		const newEvent = {
			...event,
			...processedDates,
			repeat: event.repeat[0],
		};

		await databases.createDocument(
			config.databaseId,
			config.eventsCollectionId,
			ID.unique(),
			newEvent,
		);
	} catch (error) {
		console.error('addNewEvent', error);
		return error;
	}
}
