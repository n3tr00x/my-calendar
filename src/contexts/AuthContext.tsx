import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { MainLoader } from '@/components/MainLoader';
import { getCurrentUser } from '@/lib/appwrite/auth';
import { IUser } from '@/types/appwrite';

type IAuthContext = {
	isAuthenticated: boolean;
	isLoading: boolean;
	checkUserAuthStatus: () => Promise<void>;
	removeAuthentication: () => void;
	user: IUser | null;
};

const INITIAL_AUTH_CONTEXT_STATE = {
	isAuthenticated: false,
	isLoading: false,
	checkUserAuthStatus: async () => {},
	removeAuthentication: () => {},
	user: null,
};

export const AuthContext = createContext<IAuthContext>(INITIAL_AUTH_CONTEXT_STATE);

export function AuthProvider({ children }: PropsWithChildren) {
	console.log('<AuthProvider /> render.');
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	console.log({ user, isLoading, isAuthenticated });

	const checkUserAuthStatus = async () => {
		setIsLoading(true);
		try {
			const currentAccount = (await getCurrentUser()) as IUser;

			if (!(currentAccount instanceof AppwriteException)) {
				setIsAuthenticated(true);
				setUser(currentAccount);
			}
		} catch (error) {
			setIsAuthenticated(false);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const removeAuthentication = () => {
		setUser(null);
		setIsAuthenticated(false);
	};

	useEffect(() => {
		checkUserAuthStatus();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				user,
				checkUserAuthStatus,
				removeAuthentication,
			}}
		>
			{isLoading ? <MainLoader /> : children}
		</AuthContext.Provider>
	);
}
