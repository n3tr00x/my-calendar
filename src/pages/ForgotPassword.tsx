import { useForm } from 'react-hook-form';
import { Button, Fieldset, Input, Spinner, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';

import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import { useRequestPasswordReset } from '@/hooks/appwrite';
import { RequestPasswordResetSchema } from '@/schemas/auth.schema';
import { RequestPasswordResetFormData } from '@/types/appwrite';

export function ForgotPasswordPage() {
	console.log('<ForgotPasswordPage /> render.');
	const { mutateAsync: requestPasswordReset } = useRequestPasswordReset();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RequestPasswordResetFormData>({
		resolver: zodResolver(RequestPasswordResetSchema),
	});

	const onSubmit = async ({ email }: RequestPasswordResetFormData) => {
		try {
			await requestPasswordReset(email);

			toaster.create({
				type: 'success',
				title: 'Reset link sent',
				description: 'Check your inbox to reset your password.',
			});
		} catch (error) {
			if (error instanceof AppwriteException) {
				toaster.create({
					type: 'error',
					title: 'Failed to send link',
					description: error.message,
				});
			}
		}
	};

	return (
		<Fieldset.Root>
			<Stack gap={3} mb={4}>
				<Fieldset.Legend fontSize="3xl" fontFamily="heading" fontWeight="semibold">
					Reset password
				</Fieldset.Legend>
				<Fieldset.HelperText fontSize="md" fontWeight="light" color="fg.subtle">
					Enter your email to receive a reset link
				</Fieldset.HelperText>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Fieldset.Content>
					<Field label="Email" required invalid={!!errors.email} errorText={errors.email?.message}>
						<Input {...register('email')} type="email" />
					</Field>
					<Button type="submit" colorPalette="blue" py={6} disabled={isSubmitting} fontSize="md">
						{isSubmitting ? <Spinner /> : 'Send reset link'}
					</Button>
				</Fieldset.Content>
			</form>
		</Fieldset.Root>
	);
}
