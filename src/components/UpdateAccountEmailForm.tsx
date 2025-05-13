import { useForm } from 'react-hook-form';
import { Field, Input, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { z } from 'zod';

import { toaster } from '@/components/ui/toaster';
import { useUpdateEmail } from '@/hooks/appwrite';
import { updateEmailSchema } from '@/schemas/account-settings.schema';

export function UpdateAccountEmailForm() {
	const { mutateAsync: updateEmail } = useUpdateEmail();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof updateEmailSchema>>({
		resolver: zodResolver(updateEmailSchema),
	});

	const onSubmit = async ({ email, password }: z.infer<typeof updateEmailSchema>) => {
		toaster.promise(updateEmail({ email, password }), {
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
				<Field.Root invalid={!!errors.email} required>
					<Field.Label>New email</Field.Label>
					<Input {...register('email')} type="email" />
					<Field.ErrorText>{errors.email?.message}</Field.ErrorText>
				</Field.Root>
				<Field.Root invalid={!!errors.password} required>
					<Field.Label>Password</Field.Label>
					<Input {...register('password')} type="password" />
					<Field.ErrorText>{errors.password?.message}</Field.ErrorText>
				</Field.Root>
			</VStack>
		</form>
	);
}
