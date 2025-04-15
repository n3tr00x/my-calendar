import { Container, Separator } from '@chakra-ui/react';

import { MainProfileSettings } from '@/components/MainProfileSettings';
import { SettingsHeader } from '@/components/SettingsHeader';
import { ThemeSelector } from '@/components/ThemeSelector';

export function SettingsPage() {
	return (
		<>
			<SettingsHeader />
			<Container as="main" maxWidth="lg">
				<MainProfileSettings />
				<Separator />
				<ThemeSelector />
			</Container>
		</>
	);
}
