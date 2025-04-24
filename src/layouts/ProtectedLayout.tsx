import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { MainLoader } from '@/components/MainLoader';
import { toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { isCookieFallbackInvalid } from '@/utilities/helpers';

export function ProtectedLayout() {
	console.log('<Protected Layout /> render');

	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	const shouldRedirect = isCookieFallbackInvalid() && !isAuthenticated;

	useEffect(() => {
		if (shouldRedirect) {
			navigate('/sign-in', { replace: true });

			toaster.error({
				title: `Account unauthorized. Please try to sign in again.`,
				duration: 4000,
			});
		}
	}, [shouldRedirect, navigate]);

	if (isLoading) {
		return <MainLoader />;
	}

	return <Outlet />;
}
