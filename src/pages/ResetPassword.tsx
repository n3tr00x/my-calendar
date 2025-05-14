import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Fieldset, Input, Spinner, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';

import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import { useResetPassword } from '@/hooks/appwrite';
import { ResetPasswordSchema } from '@/schemas/auth.schema';
import { ResetPasswordFormData } from '@/types/appwrite';

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { mutateAsync: resetPassword } = useResetPassword();

	const userId = searchParams.get('userId');
	const secret = searchParams.get('secret');

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(ResetPasswordSchema),
	});

	useEffect(() => {
		if (!userId || !secret) {
			toaster.create({
				type: 'error',
				title: 'Invalid link',
				description: 'Reset link is missing required parameters.',
			});
			navigate('/sign-in');
		}
	}, [userId, secret, navigate]);

	const onSubmit = async ({ password }: ResetPasswordFormData) => {
		if (!userId || !secret) return;

		try {
			await resetPassword({ userId, secret, password });

			toaster.create({
				type: 'success',
				title: 'Password changed!',
			});

			navigate('/sign-in');
		} catch (error) {
			if (error instanceof AppwriteException) {
				toaster.create({
					type: 'error',
					title: 'Reset failed',
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
					<Field
						label="Password"
						required
						invalid={!!errors.password}
						errorText={errors.password?.message}
					>
						<Input {...register('password')} type="password" />
					</Field>
					<Field
						label="Confirm Password"
						required
						invalid={!!errors.confirmPassword}
						errorText={errors.confirmPassword?.message}
					>
						<Input {...register('confirmPassword')} type="password" />
					</Field>
					<Button type="submit" colorPalette="blue" py={6} disabled={isSubmitting} fontSize="md">
						{isSubmitting ? <Spinner /> : 'Send reset link'}
					</Button>
				</Fieldset.Content>
			</form>
		</Fieldset.Root>
	);
}
