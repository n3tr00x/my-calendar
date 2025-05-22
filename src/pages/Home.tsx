import { Flex, Separator } from '@chakra-ui/react';

import { AddEventMobileBar } from '@/components/AddEventMobileBar';
import { Calendar } from '@/components/Calendar';
import { Events } from '@/components/Events';
import { Topbar } from '@/components/Topbar';

export function HomePage() {
	return (
		<Flex as="main" h="100vh" flexDirection="column" mx={2}>
			<Topbar />
			<Calendar />
			<Separator />
			<Events />
			<AddEventMobileBar />
		</Flex>
	);
}
