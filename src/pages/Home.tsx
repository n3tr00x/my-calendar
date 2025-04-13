import { Flex, Separator } from '@chakra-ui/react';

import { AddEventMobileInput } from '@/components/AddEventMobileInput';
import { Calendar } from '@/components/Calendar';
import { Events } from '@/components/Events';
import { NewEventModal } from '@/components/NewEvent';
import { Topbar } from '@/components/Topbar';
import { AddEventMobileButton } from '@/components/ui/add-event-mobile-button';

export function HomePage() {
	return (
		<Flex as="main" h="100vh" flexDirection="column" mx={2}>
			<Topbar />
			<Calendar />
			<Separator />
			<Events />
			<Flex marginTop="auto" justifyContent="space-between" gap={12} py={2} px={4}>
				<AddEventMobileInput />
				<NewEventModal dialogTriggerComponent={<AddEventMobileButton />} />
			</Flex>
		</Flex>
	);
}
