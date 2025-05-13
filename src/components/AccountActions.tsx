import { Box, Grid, Heading } from '@chakra-ui/react';
import { LockKeyhole, Mail, UserRoundPen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UpdateAccountDetailsDialog } from '@/components/UpdateAccountDetailsDialog';
import { UpdateAccountEmailForm } from '@/components/UpdateAccountEmailForm';
import { UpdateUsernameAccountForm } from '@/components/UpdateAccountUsernameForm';
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';

export function AccountActions() {
	const buttons = [
		{
			icon: <Mail />,
			label: 'Change email',
			body: <UpdateAccountEmailForm />,
		},
		{
			icon: <UserRoundPen />,
			label: 'Change username',
			body: <UpdateUsernameAccountForm />,
		},
		{
			icon: <LockKeyhole />,
			label: 'Change password',
			body: <UpdatePasswordForm />,
		},
	];

	return (
		<Box as="section" my={4}>
			<Heading as="h2" mb={4} size="lg">
				Account Actions
			</Heading>
			<Grid templateColumns="repeat(2, 1fr)" gap={4} colorPalette="blue">
				{buttons.map((button, index) => (
					<UpdateAccountDetailsDialog
						key={index}
						title={button.label}
						trigger={
							<Button key={button.label} variant="surface" size={{ base: 'xs', sm: 'sm' }}>
								{button.icon} {button.label}
							</Button>
						}
					>
						{button.body}
					</UpdateAccountDetailsDialog>
				))}
			</Grid>
		</Box>
	);
}
