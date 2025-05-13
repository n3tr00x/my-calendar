import { ID, Query } from 'appwrite';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

import { account, config, databases, storage } from '@/lib/appwrite';
import { Event, NewEventFormData, NewUser, User } from '@/types/appwrite';

export async function setAvatarImage(file: File, user: User) {
	const bucketFile = await storage.createFile(config.storageId, ID.unique(), file);
	const fileView = storage.getFileView(config.storageId, bucketFile.$id);

	if (user.avatar && user.avatarId) {
		await storage.deleteFile(config.storageId, user.avatarId);
	}

	const newAvatarImage = {
		avatar: fileView,
		avatarId: bucketFile.$id,
	};

	await databases.updateDocument(
		config.databaseId,
		config.usersCollectionId,
		user.$id,
		newAvatarImage,
	);
}

export async function saveNewUser(user: NewUser) {
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

export async function addNewEvent(event: NewEventFormData, user: User) {
	const newEvent = {
		...event,
		startDate: startOfDay(event.startDate).toISOString(),
		endDate: endOfDay(event.endDate).toISOString(),
		repeat: event.repeat[0],
		accountId: user.accountId,
		user: user.$id,
	};

	await databases.createDocument(
		config.databaseId,
		config.eventsCollectionId,
		ID.unique(),
		newEvent,
	);
}

export async function updateEvent(eventId: string, updatedEvent: Partial<NewEventFormData>) {
	const editedEvent = {
		...updatedEvent,
		...(updatedEvent.startDate && { startDate: startOfDay(updatedEvent.startDate).toISOString() }),
		...(updatedEvent.endDate && { endDate: endOfDay(updatedEvent.endDate).toISOString() }),
		...(updatedEvent.repeat && { repeat: updatedEvent.repeat[0] }),
	};

	return await databases.updateDocument(
		config.databaseId,
		config.eventsCollectionId,
		eventId,
		editedEvent,
	);
}

export async function removeEvent(eventId: string) {
	return await databases.deleteDocument(config.databaseId, config.eventsCollectionId, eventId);
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
