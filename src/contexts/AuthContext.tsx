import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { MainLoader } from '@/components/MainLoader';
import { toaster } from '@/components/ui/toaster';
import { getCurrentUser } from '@/lib/appwrite/auth';
import { IUser } from '@/types/appwrite';

type IAuthContext = {
	isAuthenticated: boolean;
	isLoading: boolean;
	checkUserAuthStatus: () => Promise<string | undefined>;
	refetchCurrentUser: () => Promise<void>;
	removeAuthentication: () => void;
	user: IUser | null;
};

const INITIAL_AUTH_CONTEXT_STATE = {
	isAuthenticated: false,
	isLoading: false,
	checkUserAuthStatus: async () => '',
	removeAuthentication: () => {},
	refetchCurrentUser: async () => {},
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
			const currentAccount = await getCurrentUser();
			setIsAuthenticated(true);
			setUser(currentAccount);
		} catch (error) {
			if (
				error instanceof AppwriteException &&
				window.location.pathname !== '/sign-in' &&
				window.location.pathname !== '/sign-up'
			) {
				const code = error.code;
				return toaster.create({
					title: `Account unauthorized. Please try to sign in again. Code ${code}`,
					type: 'error',
					duration: 4000,
				});
			}
			setIsAuthenticated(false);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const refetchCurrentUser = async () => {
		try {
			if (!user) {
				throw new Error('Not authorized');
			}

			const currentAccount = await getCurrentUser();
			setUser(currentAccount);
		} catch (error) {
			if (
				error instanceof AppwriteException &&
				window.location.pathname !== '/sign-in' &&
				window.location.pathname !== '/sign-up'
			) {
				const code = error.code;

				toaster.create({
					title: `Account unauthorized. Code ${code}`,
					type: 'error',
					duration: 4000,
				});
			}

			setUser(null);
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
				refetchCurrentUser,
			}}
		>
			{isLoading ? <MainLoader /> : children}
		</AuthContext.Provider>
	);
}
