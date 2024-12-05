import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';

import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedLayout() {
	console.log('<Protected Layout /> render');

	const { isOpen, onOpen, onClose } = useDisclosure();
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

	return (
		<main>
			<Sidebar isOpen={isOpen} onClose={onClose} />
			<Topbar onOpen={onOpen} />
			<Outlet />
		</main>
	);
}
