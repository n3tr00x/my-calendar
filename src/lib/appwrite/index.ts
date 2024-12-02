import { Account, Client, Databases } from 'appwrite';

export const config = {
	url: import.meta.env.VITE_APPWRITE_URL,
	projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
	databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
	usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
};

const client = new Client().setEndpoint(config.url).setProject(config.projectId);
export const account = new Account(client);
export const databases = new Databases(client);
