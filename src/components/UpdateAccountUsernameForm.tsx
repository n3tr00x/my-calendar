import { useForm } from 'react-hook-form';
import { Field, Input } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { z } from 'zod';

import { toaster } from '@/components/ui/toaster';
import { useUpdateUsername } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { updateUsernameSchema } from '@/schemas/account-settings.schema';

export function UpdateUsernameAccountForm() {
	const { user, checkUserAuthStatus } = useAuth();
	const { mutateAsync: updateUsername } = useUpdateUsername();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof updateUsernameSchema>>({
		resolver: zodResolver(updateUsernameSchema),
	});

	const onSubmit = async ({ username }: z.infer<typeof updateUsernameSchema>) => {
		toaster.promise(updateUsername(username), {
			success: { title: 'The password has been changed correctly' },
			error: error => ({
				title: 'Failed to update password',
				description:
					error instanceof AppwriteException
						? error.message
						: 'An unexpected error occurred. Please try again.',
			}),
			loading: { title: 'Updating your password...' },
		});

		await checkUserAuthStatus();
	};

	return (
		<form id="update-account-details-form" onSubmit={handleSubmit(onSubmit)}>
			<Field.Root invalid={!!errors.username} required>
				<Field.Label>Username</Field.Label>
				<Input {...register('username')} defaultValue={user?.name} type="text" />
				<Field.ErrorText>{errors.username?.message}</Field.ErrorText>
			</Field.Root>
		</form>
	);
}
