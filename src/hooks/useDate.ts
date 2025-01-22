import { useContext } from 'react';

import { DateContext } from '@/contexts/DateContext';

export function useDate() {
	const date = useContext(DateContext);

	if (!date) {
		throw new Error('the useAuth must be nested in AuthProvider component.');
	}

	return date;
}
