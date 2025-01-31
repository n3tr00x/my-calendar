import { ID, Query } from 'appwrite';

import { account, config, databases } from '@/lib/appwrite';
import { Event, INewUser, NewEvent } from '@/types/appwrite';
import { formatToISODate } from '@/utilities/date';

export async function saveNewUser(user: INewUser) {
	return await databases.createDocument(
		config.databaseId,
		config.usersCollectionId,
		ID.unique(),
		user,
	);
}

export async function getEvents(date: Date) {
	const currentAccount = await account.get();

	if (!currentAccount) {
		throw new Error('No logged user.');
	}

	const events = await databases.listDocuments(config.databaseId, config.eventsCollectionId, [
		Query.equal('accountId', currentAccount.$id),
		Query.and([
			Query.lessThanEqual('startDate', formatToISODate(date)),
			Query.greaterThanEqual('endDate', formatToISODate(date)),
		]),
	]);

	return events.documents as Event[];
}

export async function addNewEvent(event: NewEvent) {
	const processedDates = {
		startDate: formatToISODate(new Date(event.startDate)),
		endDate: formatToISODate(new Date(event.endDate)),
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
}
