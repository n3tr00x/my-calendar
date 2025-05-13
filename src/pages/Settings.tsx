import { Container, Stack, StackSeparator } from '@chakra-ui/react';

import { AccountActions } from '@/components/AccountActions';
import { CreatorInformation } from '@/components/CreatorInformation';
import { MainProfileSettings } from '@/components/MainProfileSettings';
import { SettingsFooter } from '@/components/SettingsFooter';
import { SettingsHeader } from '@/components/SettingsHeader';
import { ThemeSelector } from '@/components/ThemeSelector';

export function SettingsPage() {
	return (
		<>
			<SettingsHeader />
			<Container as="main" maxWidth="lg">
				<Stack separator={<StackSeparator />}>
					<MainProfileSettings />
					<ThemeSelector />
					<AccountActions />
					<CreatorInformation />
					<SettingsFooter />
				</Stack>
			</Container>
		</>
	);
}
