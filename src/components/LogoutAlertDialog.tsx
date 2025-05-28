import { ReactElement, RefAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonProps } from '@chakra-ui/react';

import { AlertDialog } from '@/components/AlertDialog';
import { toaster } from '@/components/ui/toaster';
import { useSignOutAccount } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';

type LogoutAlertDialogProps = {
	trigger: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

export function LogoutAlertDialog({ trigger }: LogoutAlertDialogProps) {
	const navigate = useNavigate();
	const { removeAuthentication } = useAuth();
	const { mutateAsync: signOut } = useSignOutAccount();

	const signOutHandler = async () => {
		await signOut();
		removeAuthentication();
		navigate('/sign-in', { replace: true });

		toaster.create({
			title: 'You have been logged out successfully.',
			type: 'success',
			duration: 4000,
		});
	};

	return (
		<AlertDialog
			trigger={trigger}
			action={signOutHandler}
			actionButtonLabel="Log out"
			title="Leaving your account"
			description="Your session will be ended. Do you want to continue?"
		/>
	);
}
