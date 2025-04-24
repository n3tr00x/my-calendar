import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { ErrorPage } from '@/pages/Error';
import { HomePage } from '@/pages/Home';
import { SettingsPage } from '@/pages/Settings';
import { SignInPage } from '@/pages/SignIn';
import { SignUpPage } from '@/pages/SignUp';
import { VerifyEmailPage } from '@/pages/VerifyEmail';

export default function App() {
	const router = createBrowserRouter([
		{
			element: <AuthLayout />,
			errorElement: <ErrorPage />,
			children: [
				{ path: '/sign-up', element: <SignUpPage /> },
				{ path: '/sign-in', element: <SignInPage /> },
				{ path: '/verify-email', element: <VerifyEmailPage /> },
			],
		},
		{
			element: <ProtectedLayout />,
			children: [
				{ path: '/', element: <HomePage /> },
				{ path: '/settings', element: <SettingsPage /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}
