import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { Home } from '@/pages/Home';
import { SignInPage } from '@/pages/SignIn';
import { SignUpPage } from '@/pages/SignUp';

export default function App() {
	const router = createBrowserRouter([
		{
			element: <AuthLayout />,
			children: [
				{ path: '/sign-up', element: <SignUpPage /> },
				{ path: '/sign-in', element: <SignInPage /> },
			],
		},
		{
			element: <ProtectedLayout />,
			children: [
				{ path: '/', element: <Home /> },
				{ path: '/settings', element: <h1>Settings</h1> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}
