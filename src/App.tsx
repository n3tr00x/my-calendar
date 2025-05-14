import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { ErrorPage } from '@/pages/Error';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { HomePage } from '@/pages/Home';
import { ResetPasswordPage } from '@/pages/ResetPassword';
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
				{ path: '/forgot-password', element: <ForgotPasswordPage /> },
				{ path: '/reset-password', element: <ResetPasswordPage /> },
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
