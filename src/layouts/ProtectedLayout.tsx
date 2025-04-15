import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

export function ProtectedLayout() {
	console.log('<Protected Layout /> render');

	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (
			(localStorage.getItem('cookieFallback') === null ||
				localStorage.getItem('cookieFallback') === '[]') &&
			!isAuthenticated
		) {
			navigate('/sign-in', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	if (isLoading || !isAuthenticated) {
		return null;
	}

	return <Outlet />;
}
