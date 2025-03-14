import { ID, Query } from 'appwrite';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

import { account, config, databases } from '@/lib/appwrite';
import { Event, INewUser, NewEvent, NewEventForm } from '@/types/appwrite';

export async function saveNewUser(user: INewUser) {
	return await databases.createDocument(
		config.databaseId,
		config.usersCollectionId,
		ID.unique(),
		user,
	);
}

export async function getEvents(date: Date) {
	const minDate = startOfWeek(startOfMonth(date));
	const maxDate = endOfWeek(endOfMonth(date));

	const currentAccount = await account.get();

	if (!currentAccount) {
		throw new Error('No logged user.');
	}

	const events = await databases.listDocuments(config.databaseId, config.eventsCollectionId, [
		Query.equal('accountId', currentAccount.$id),
		Query.and([
			Query.greaterThanEqual('startDate', minDate.toISOString()),
			Query.lessThanEqual('endDate', maxDate.toISOString()),
		]),
	]);

	return events.documents as Event[];
}

export async function addNewEvent(event: NewEvent) {
	const newEvent = {
		...event,
		startDate: startOfDay(event.startDate).toISOString(),
		endDate: endOfDay(event.endDate).toISOString(),
		repeat: event.repeat[0],
	};

	await databases.createDocument(
		config.databaseId,
		config.eventsCollectionId,
		ID.unique(),
		newEvent,
	);
}

export async function updateEvent(eventId: string, updatedEvent: Partial<NewEventForm>) {
	console.log('update event');

	const editedEvent = {
		...updatedEvent,
		...(updatedEvent.startDate && { startDate: startOfDay(updatedEvent.startDate).toISOString() }),
		...(updatedEvent.endDate && { endDate: endOfDay(updatedEvent.endDate).toISOString() }),
		...(updatedEvent.repeat && { repeat: updatedEvent.repeat[0] }),
	};

	await databases.updateDocument(
		config.databaseId,
		config.eventsCollectionId,
		eventId,
		editedEvent,
	);
}

export async function removeEvent(eventId: string) {
	await databases.deleteDocument(config.databaseId, config.eventsCollectionId, eventId);
}

export async function getEventsByEventName(eventName: string) {
	const foundEvents = await databases.listDocuments(config.databaseId, config.eventsCollectionId, [
		Query.contains('title', eventName),
	]);

	if (!foundEvents) {
		throw new Error('No found events.');
	}

	return foundEvents.documents as Event[];
}
