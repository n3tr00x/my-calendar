import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { useSignOutAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedLayout() {
	console.log('<Protected Layout /> render');
	const { isAuthenticated, removeAuthentication, isLoading } = useAuth();
	const { mutateAsync: signOut } = useSignOutAccount();
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

	return (
		<section>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/settings">Settings</Link>
			</nav>
			<Button
				onClick={async () => {
					await signOut();
					removeAuthentication();
					navigate('/sign-in');
				}}
			>
				log out
			</Button>
			<Outlet />
		</section>
	);
}
