import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { getCurrentUser } from '@/lib/appwrite/auth';
import type { User } from '@/types/appwrite';
import { isAuthPage } from '@/utilities/helpers';

type IAuthContext = {
	isAuthenticated: boolean;
	isLoading: boolean;
	checkUserAuthStatus: () => Promise<void>;
	removeAuthentication: () => void;
	user: User | null;
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
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	console.log({ user, isLoading, isAuthenticated });

	const checkUserAuthStatus = async () => {
		try {
			const currentAccount = await getCurrentUser();
			setIsAuthenticated(true);
			setUser(currentAccount);
		} catch (error) {
			if (error instanceof AppwriteException && error.code === 401 && isAuthPage()) {
				return;
			}

			setIsAuthenticated(false);
			setUser(null);
			throw error;
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
			{children}
		</AuthContext.Provider>
	);
}
