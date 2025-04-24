import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppwriteException } from 'appwrite';

import { toaster } from '@/components/ui/toaster';
import { updateVerification } from '@/lib/appwrite/auth';

export function VerifyEmailPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const userId = searchParams.get('userId');
	const token = searchParams.get('secret');

	const verifyEmail = useCallback(async () => {
		try {
			if (userId && token) {
				await updateVerification(userId, token);

				toaster.create({
					type: 'success',
					title: 'Email verified',
					description:
						'Your email has been successfully verified. You can now continue using your account.',
				});
			}
		} catch (error) {
			if (error instanceof AppwriteException) {
				toaster.create({
					type: 'error',
					title: 'Verfication error',
					description: error.message,
				});
			}
		} finally {
			navigate('/sign-in');
		}
	}, [userId, token, navigate]);

	useEffect(() => {
		verifyEmail();
	}, [verifyEmail]);

	return <></>;
}
