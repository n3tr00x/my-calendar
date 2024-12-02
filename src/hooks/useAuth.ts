import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
	const auth = useContext(AuthContext);

	if (!auth) {
		throw new Error('the useAuth must be nested in AuthProvider component.');
	}

	return auth;
}
