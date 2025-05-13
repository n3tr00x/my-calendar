import { useForm } from 'react-hook-form';
import { Field, Input, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { z } from 'zod';

import { toaster } from '@/components/ui/toaster';
import { useUpdatePassword } from '@/hooks/appwrite';
import { updatePasswordSchema } from '@/schemas/account-settings.schema';

export function UpdatePasswordForm() {
	const { mutateAsync: updatePassword } = useUpdatePassword();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof updatePasswordSchema>>({
		resolver: zodResolver(updatePasswordSchema),
	});

	const onSubmit = async ({ oldPassword, password }: z.infer<typeof updatePasswordSchema>) => {
		toaster.promise(updatePassword({ newPassword: password, oldPassword }), {
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
	};

	return (
		<form id="update-account-details-form" onSubmit={handleSubmit(onSubmit)}>
			<VStack gap={2}>
				<Field.Root invalid={!!errors.oldPassword} required>
					<Field.Label>Old password</Field.Label>
					<Input {...register('oldPassword')} type="password" />
					<Field.ErrorText>{errors.oldPassword?.message}</Field.ErrorText>
				</Field.Root>
				<Field.Root invalid={!!errors.password} required>
					<Field.Label>Password</Field.Label>
					<Input {...register('password')} type="password" />
					<Field.ErrorText>{errors.password?.message}</Field.ErrorText>
				</Field.Root>
				<Field.Root invalid={!!errors.repeatPassword} required>
					<Field.Label>Confirm new password</Field.Label>
					<Input {...register('repeatPassword')} type="password" />
					<Field.ErrorText>{errors.repeatPassword?.message}</Field.ErrorText>
				</Field.Root>
			</VStack>
		</form>
	);
}
