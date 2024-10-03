import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
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
	]);

	return <RouterProvider router={router} />;
}
